import { searchImoveis } from "../services/imovelService.js";
import scrapeOlx from "../services/scrapers/olxScrapper.js";


export const fetchImoveis = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Busca opcionalmente um cliente pelo ID (se necessário)
      if (id) {
        const resultado = await searchImoveis(id);
        if (!resultado.success) {
          return res.status(404).json({ message: resultado.message });
        }
      }
  
      const imoveis = await scrapeOlx();
      res.json({ imoveis });
    } catch (error) {
      res.status(500).json({ message: "❌ Erro ao buscar imóveis", error });
    }
}