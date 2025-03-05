import cron from "node-cron";
import scrapeOlx from "./olxScrapper.js";
import { fetchAllUsers } from "./user.service.js";
import { searchClientsByUserId } from "./client.service.js";
import { saveImoveisNoBanco, ImovelEnviado } from "./imovel.service.js";
import { sendWhatsApp } from "./whatsapp.service.js";

cron.schedule("0 8 * * *", async () => {
  console.log("⏳ Iniciando o scraping diário...");

 // try {
    const users = await fetchAllUsers();

    for (const user of users) {
      console.log(`👤 Buscando clientes de ${user.email}...`);
      const clientes = await searchClientsByUserId(user._id);
      console.log(clientes)

     /* for (const cliente of clientes) {
        console.log(`📢 Buscando imóveis para ${cliente.email}...`);

        // 1️⃣ Faz o scraping dos imóveis para o cliente
        const novosImoveis = await scrapeOlx(cliente);

        // 2️⃣ Pega os links que já foram enviados para esse cliente
        const linksEnviados = await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link");

        // 3️⃣ Filtra apenas os imóveis que ainda não foram enviados
        const imoveisFrescos = novosImoveis.filter(imovel => !linksEnviados.includes(imovel.link));

        if (imoveisFrescos.length > 0) {
          // 4️⃣ Envia os novos imóveis para o cliente
          await sendWhatsApp(cliente.telefone, "Novos imóveis disponíveis!", imoveisFrescos.slice(0, 3));

          // 5️⃣ Salva os links dos imóveis enviados no banco
          await ImovelEnviado.insertMany(
            imoveisFrescos.map(imovel => ({
              link: imovel.link,
              clienteId: cliente._id,
            }))
 
          console.log(`✅ ${imoveisFrescos.length} imóveis enviados para ${cliente.email}`);
        } else {
          console.log(`❌ Nenhum imóvel novo para ${cliente.email} hoje.`);
        }

      }
    }
  } catch (error) {
    console.error("❌ Erro no cron job:", error);

  }
  */
    }},
{
  scheduled: true,
  timezone: "America/Sao_Paulo",
});
