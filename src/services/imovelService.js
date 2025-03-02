import scrapeOlx from "./scrapers/olxScrapper.js";

export const searchImoveis = async (id) => {
    try {
      const imoveis = await scrapeOlx()
      if (!imoveis) {
        return { success: false, message: "❌ Cliente não encontrado" };
      }
      return { success: true, cliente };
    } catch (error) {
      return { success: false, error };
    }}