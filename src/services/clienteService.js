import Cliente from "../models/cliente.js";
import ImovelEnviado from "../models/imovel.js";
import sendWhatsApp from "../utils/sendWhatsapp.js";
import scrapeOlx from "./scrapers/olxScrapper.js";

export const createAClient = async (dadosCliente) => {
  try {
    const cliente = new Cliente(dadosCliente);
    await cliente.save();
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
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
    await sendWhatsApp("Novos imóveis disponíveis!", linksEnviados.slice(0, 3));

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


export const searchClientById = async (id) => {
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return { success: false, message: "Cliente não encontrado" };
    }
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};


export const searchAllClients = async () => {
  try {
    return await Cliente.find();
  } catch (error) {
    throw new Error("Erro ao buscar clientes");
  }
};