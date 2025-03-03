import Cliente from "../models/cliente.js"; // Importando seu modelo de clientes
import scrapeOlx from "../services/scrapers/olxScrapper.js"; // Função que já envia os imóveis

export const processarTodosClientes = async () => {
  console.log("🔄 Iniciando envio de imóveis para todos os clientes...");

  try {
    const clientes = await Cliente.find(); // Pega todos os clientes do banco
    for (const cliente of clientes) {
      await scrapeAndSendDaily(cliente);
    }

    console.log("✅ Processo de envio finalizado para todos os clientes.");
  } catch (error) {
    console.error("❌ Erro ao processar clientes:", error);
  }
};

export const scrapeAndSendDaily = async (cliente) => {
    console.log(`📢 Buscando imóveis para ${cliente.email}...`);
    
    // 1️⃣ Faz o scraping dos imóveis
    const novosImoveis = await scrapeOlx(cliente);
    
    // 2️⃣ Pega os links que já foram enviados para esse cliente
    const linksEnviados = await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link");
  
    // 3️⃣ Filtra apenas os imóveis que ainda não foram enviados
    //const imoveisFrescos = novosImoveis.filter(imovel => !linksEnviados.includes(imovel.link));
  
    //if (imoveisFrescos.length > 0) {
      // 4️⃣ Envia os novos imóveis para o cliente
    await sendWhatsApp(`Novos imóveis disponíveis para o cliente: ${cliente.nome}}!`, linksEnviados.slice(0, 3));
  
      // 5️⃣ Salva os links dos imóveis enviados no banco
      // await ImovelEnviado.insertMany(
      //   imoveisFrescos.map(imovel => ({
      //     link: imovel.link,
      //     clienteId: cliente._id,
      //   }))
      // );
  
  //    console.log(`✅ ${imoveisFrescos.length} imóveis enviados para ${cliente.email}`);
  //  } else {
   //   console.log(`❌ Nenhum imóvel novo para ${cliente.email} hoje.`);
   // }
  };
  