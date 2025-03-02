import { criarCliente, buscarClientePorId } from "../services/clienteService.js";
import scrapeOlx from "../services/scrapers/olxScrapper.js";



export const criarClienteC = async (req, res) => {
  const resultado = await criarCliente(req.body);

  if (resultado.success) {
    return res.status(201).json({ message: "✅ Cliente cadastrado com sucesso!", cliente: resultado.cliente });
  }

  return res.status(400).json({ message: "❌ Erro ao criar cliente", error: resultado.error });
};
