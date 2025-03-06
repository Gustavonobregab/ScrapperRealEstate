import mongoose from "mongoose";
import { config } from "../config/config.js";  // Importando as configurações
import { fetchAllUsers } from "../services/userService.js";
import { searchClientsByUserId } from "../services/clienteService.js";
import scrapeOlx from "./olxScrapper.js";
import ImovelEnviado from "../models/imovel.js";
// import sendWhatsApp from "../utils/sendWhatsapp.js";
import { sendEmail } from "../utils/sendEmail.js";

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
      //  console.log(`👤 Buscando clientes de ${user.email} | Usuário: ${user.nome}...`);
        
        const clientes = await searchClientsByUserId(user._id);
        const clientesArr = clientes.clientes; 

        for (const cliente of clientesArr) {
      //    console.log(`\n==============================`);
       //   console.log(`📢 Buscando imóveis para ${cliente.email} | Cliente: ${cliente.nome}`);
        //  console.log(`💰 Faixa de preço: R$${cliente.valorMin} - R$${cliente.valorMax}`);
        //  console.log(`🏡 Modalidade: ${cliente.modalidade}`);
        //  console.log(`==============================\n`);
          
          // Faz o scraping dos imóveis para o cliente
          const novosImoveis = await scrapeOlx(cliente);

          // Exibir os imóveis encontrados de forma mais organizada
          if (novosImoveis.length > 0) {
              console.log(`🏠 Imóveis encontrados para ${cliente.nome} (${cliente.email}):`);
              console.log(novosImoveis);
          } else {
              console.log(`🚫 Nenhum imóvel encontrado para ${cliente.nome}`);
              continue;  // Se não houver imóveis, pula para o próximo cliente
          }

          // Buscar os links dos imóveis já enviados para este cliente
          const linksEnviados = await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link");

          // Filtrar apenas os imóveis que ainda não foram enviados
          const imoveisFrescos = novosImoveis.filter(imovel => !linksEnviados.includes(imovel.link));

          // Se houver imóveis frescos, envia no WhatsApp e registra no banco
          if (imoveisFrescos.length > 0) {
              console.log(`🏠 ${imoveisFrescos.length} novos imóveis para ${cliente.nome} (${cliente.email}):`);
        /*      imoveisFrescos.forEach((imovel, index) => {
                  console.log(`  ${index + 1}. 📍 Localização: ${imovel.localizacao}`);
                  console.log(`     💰 Preço: R$${imovel.preco}`);
                  console.log(`     🔗 Link: ${imovel.link}`);
                  console.log(`---------------------------------`);
              }); */

              //  console.log("Imoveis enviados para o cliente",imoveisFrescos.slice(0,3))
              // Enviar no WhatsApp os primeiros 3 imóveis não enviados


              console.log(imoveisFrescos)
       //       await sendEmail(`🚀 Captação Fresquinha chegando para: ${cliente.nome}`, imoveisFrescos.slice(0, 3));

            // Registrar os imóveis enviados no banco de dados para garantir que não sejam enviados novamente
         /*     const imoveisEnviados = imoveisFrescos.map(imovel => ({
                  link: imovel.link,
                  clienteId: cliente._id,
              }));

              // Inserir no banco de dados, e se o imóvel já foi enviado para o cliente, ele vai ignorar
              try {
                  await ImovelEnviado.insertMany(imoveisEnviados, { ordered: false });
              } catch (error) {
                  console.log(`⚠️ Alguns imóveis já foram enviados para ${cliente.nome} (erro de duplicação), mas os outros foram inseridos.`);
              }*/

  
           //   console.log(`✅ ${imoveisFrescos.length} imóveis enviados`);
          } else {
              console.log(`🚫 Nenhum novo imóvel encontrado para ${cliente.nome}`);
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
