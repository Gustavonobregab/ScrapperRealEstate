import Cliente from "../models/cliente.js";
import scrapeOlx from "../services/olxScrapper.js";

export const criarCliente = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json({ message: "✅ Cliente cadastrado com sucesso!", cliente });
  } catch (error) {
    res.status(400).json({ message: "❌ Erro ao criar cliente", error });
  }
};

export const buscarImoveis = async (req, res) => {
  try {
   

   // let cliente = null;
   /* if (id) {
      cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "❌ Cliente não encontrado" });
      }
    }
    */
    const imoveis = await scrapeOlx();
    res.json({ imoveis });
  } catch (error) {
    res.status(500).json({ message: "❌ Erro ao buscar imóveis", error });
  }
};
