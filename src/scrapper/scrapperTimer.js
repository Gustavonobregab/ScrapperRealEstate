
import scrapeOlx from "./olxScrapper.js";
import { saveImoveisNoBanco } from "./imovel.service"; 


cron.schedule("0 8 * * *", async () => {
    console.log("⏳ Iniciando o scraping diário...");
  
    try {
      const novosImoveis = await scrapeOlx();
      if (novosImoveis.length > 0) {
        await saveImoveisNoBanco(novosImoveis);
        console.log(`✅ ${novosImoveis.length} imóveis salvos no banco.`);
      } else {
        console.log("❌ Nenhum imóvel novo encontrado.");
      }
    } catch (error) {
      console.error("❌ Erro no cron job:", error);
    }
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  });