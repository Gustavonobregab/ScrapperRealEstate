import mongoose from "mongoose";
import { config } from "../config/config.js";  // Importando as configurações
import { fetchAllUsers } from "../services/userService.js";
import { searchClientsByUserId } from "../services/clienteService.js";
import scrapeOlx from "./olxScrapper.js";

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
    console.log(users);

    for (const user of users) {
        console.log(`👤 Buscando clientes de ${user.email} User: ${user.nome}!...`);
        const clientes = await searchClientsByUserId(user._id);
        const clientesArr = clientes.clientes; 

        for (const cliente of clientesArr) {
          console.log(`\n==============================`);
          console.log(`📢 Buscando imóveis para ${cliente.email} | Cliente: ${cliente.nome}`);
          console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
          console.log(`🏡 Modalidade: ${cliente.modalidade}`);
          console.log(`==============================\n`);
          
          // Faz o scraping dos imóveis para o cliente
          const novosImoveis = await scrapeOlx(cliente);
  
          // Exibir os imóveis encontrados de forma mais organizada
          if (novosImoveis.length > 0) {
              console.log(`🏠 Imóveis encontrados para ${cliente.nome} (${cliente.email}):`);
              console.log(novosImoveis)
           /*   novosImoveis.forEach((imovel, index) => {
                  console.log(`     💰 Preço: R$${imovel.preco}`);
                  console.log(`     🔗 Link: ${imovel.link}`);
                  console.log(`---------------------------------`);
                 
              });   */
          } else {
              console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
          }

          
        }
  
    }

    
        
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
  } finally {
    mongoose.connection.close();
  }
};

runScraping();