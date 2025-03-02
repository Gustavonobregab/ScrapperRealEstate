import { searchImoveis } from "../services/imovelService.js";
import scrapeOlx from "../services/scrapers/olxScrapper.js";
import AppError from "../utils/error.js";



export const fetchAllImoveis = async (req, res, next) => {
    try {
          
        const resultado = await searchImoveis();
        if (!resultado.success) {
          return res.status(404).json({ message: resultado.message });
        }
      
        res.json({ resultado });
    } catch (error) {
      next(error)
    }

    
}