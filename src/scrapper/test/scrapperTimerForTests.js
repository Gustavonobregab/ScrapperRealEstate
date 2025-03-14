import mongoose from "mongoose";
import { config } from "../../config/config.js";
import { fetchAllUsers } from "../../services/userService.js";
import { searchClientsByUserId } from "../../services/clienteService.js";
import scrapeOlx from "../olxScrapper.js";
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
      console.log(clientes);

      for (const cliente of clientes.clientes) {
     //   await processClienteTest(cliente)
        await processCliente(cliente);
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

  const novosImoveis = await scrapeOlx(cliente);
  if (!novosImoveis.length) {
    console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
    return;
  }

  // Obtendo os links que já foram enviados para este cliente específico
  const linksEnviados = new Set(
    await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link")
  );
  console.log("🔗 Links já enviados:", linksEnviados);

  // Filtrar apenas os imóveis que ainda não foram enviados para este cliente
  const imoveisFrescos = novosImoveis
    .filter(imovel => !linksEnviados.has(imovel.link)) // Agora usa o link original
    .slice(0, 3);

  if (!imoveisFrescos.length) {
    console.log(`🚫 Nenhum novo imóvel para ${cliente.nome}`);
    return;
  }

  console.log(`🏠 Enviando ${imoveisFrescos.length} imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(imoveisFrescos);

   await sendEmail(`🚀 Captação Fresquinha chegando para: ${cliente.nome}`, imoveisFrescos);
  // Inserindo os novos imóveis no banco de dados

  try {
    const insertedImoveis = await ImovelEnviado.insertMany(
      imoveisFrescos.map(imovel => ({
        link: imovel.link, // Agora salva o link sem normalização
        clienteId: cliente._id,
      })),
      { ordered: false }
    );



    console.log("✅ Imóveis adicionados:");
    insertedImoveis.forEach(imovel => {
      console.log(`📌 ID: ${imovel._id}, Link: ${imovel.link}`);
    });
  } catch (error) {
    console.log("⚠️ Alguns imóveis já foram enviados anteriormente.");
  }
};


const processClienteTest = async (cliente) => {
  console.log(`📢 Testando busca de imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
  console.log(`🏡 Modalidade: ${cliente.modalidade}`);

  const novosImoveis = await scrapeOlx(cliente);
  if (!novosImoveis.length) {
    console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
    return;
  }

  console.log(`🏠 Imóveis encontrados para ${cliente.nome}:`);
  console.log(novosImoveis);
};




runScraping();
