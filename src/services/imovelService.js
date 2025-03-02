import scrapeOlx from "./scrapers/olxScrapper.js";

export const searchImoveis = async (id) => {
    try {
      const imoveis = await scrapeOlx()
      if (!imoveis) {
        return { success: false, message: "❌ Cliente não encontrado" };
      }
      return { success: true, imoveis };
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error); // Log do erro no servidor
      return { success: false, error };
    }}