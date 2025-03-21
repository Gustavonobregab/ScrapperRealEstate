import mongoose from "mongoose";
import { config } from "../../config/config.js";
import { fetchAllUsers } from "../../services/userService.js";
import { searchClientsByUserId } from "../../services/clienteService.js";
import scrapeOlxTest from "./olxScrapperTest.js";
import ImovelEnviado from "../../models/imovel.js";
import { sendEmail } from "../../utils/sendEmail.js";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Conectado ao MongoDB");
  } catch (error) {
    console.error("❌ Erro na conexão com o MongoDB:", error);
  }
};


const runScraping = async () => {
  await connectToMongoDB();
  try {
    const users = await fetchAllUsers();
    for (const user of users) {
      const clientes = await searchClientsByUserId(user._id);

      for (const cliente of clientes.clientes) {
        await processClienteTest(cliente)
      }
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuários ou clientes:", error);
  } finally {
    mongoose.connection.close();
  }
};


const processCliente = async (cliente) => {
  console.log(`📢 Buscando imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
  console.log(`🏡 Modalidade: ${cliente.modalidade}`);
  
  const allImoveis = await scrapeOlxTest(cliente);

  // Junta todos os arrays de imóveis em um único array
  const listaUnicaDeImoveis = Object.values(allImoveis).flat();
  console.log("📦 Total de imóveis captados:", listaUnicaDeImoveis.length);

  const linksEnviados = new Set(
    await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link")
  );
  console.log("🔗 Links já enviados:", linksEnviados.size);


  console.log("Lista de imoveis novos captados:",listaUnicaDeImoveis)
  const imoveisFrescos = listaUnicaDeImoveis
    .filter(imovel => !linksEnviados.has(imovel.link))
  

  if (!imoveisFrescos.length) {
    console.log(`🚫 Nenhum NOVO imóvel para ${cliente.nome}`);
    return;
  }

  console.log(`🏠 Enviando ${imoveisFrescos.length} imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(imoveisFrescos);

   await sendEmail(`🚀 Captação Fresquinha chegando para: ${cliente.nome}`, imoveisFrescos);

  try {
    
    const insertedImoveis = await ImovelEnviado.insertMany(
      imoveisFrescos.map(imovel => ({
        link: imovel.link,
        clienteId: cliente._id,
      })),
      { ordered: false }
    );

    insertedImoveis.forEach(imovel => {
      console.log(`📌 ID: ${imovel._id}, Link: ${imovel.link}`);
    });
    
  } catch (error) {
    console.log("⚠️ Alguns imóveis já foram enviados anteriormente.");
  }
};


const processClienteTest = async (cliente) => {
  console.log(`🧪 TESTE: Buscando todos os imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
  console.log(`🏡 Modalidade: ${cliente.modalidade}`);

  const allImoveis = await scrapeOlxTest(cliente);

  // Junta todos os arrays de imóveis em um único array
  const listaUnicaDeImoveis = Object.values(allImoveis).flat();
  console.log("📦 Total de imóveis captados (sem filtro):", listaUnicaDeImoveis.length);

  if (!listaUnicaDeImoveis.length) {
    console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
    return;
  }

  console.log(`🏠 Enviando TODOS os ${listaUnicaDeImoveis.length} imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(listaUnicaDeImoveis);

  // Envia os imóveis sem considerar se já foram enviados antes
  await sendEmail(`🧪 TESTE: Todos os imóveis captados para: ${cliente.nome}`, listaUnicaDeImoveis);
};



runScraping();
