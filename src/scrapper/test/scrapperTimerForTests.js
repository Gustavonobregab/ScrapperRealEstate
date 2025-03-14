import mongoose from "mongoose";
import { config } from "../../config/config.js";
import { fetchAllUsers } from "../../services/userService.js";
import { searchClientsByUserId } from "../../services/clienteService.js";
import scrapeOlxTest from "./olxScrapperTest.js";
import ImovelEnviado from "../../models/imovel.js";

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
        await processClienteTest(cliente)
      }
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuários ou clientes:", error);
  } finally {
    mongoose.connection.close();
  }
};


const processClienteTest = async (cliente) => {
  console.log(`📢 Testando busca de imóveis para ${cliente.nome} (${cliente.email})`);
  console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
  console.log(`🏡 Modalidade: ${cliente.modalidade}`);

  const novosImoveis = await scrapeOlxTest(cliente);
  if (!novosImoveis.length) {
    console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
    return;
  }

  console.log(`🏠 Imóveis encontrados para ${cliente.nome}:`);
  console.log(novosImoveis);
};



runScraping();
