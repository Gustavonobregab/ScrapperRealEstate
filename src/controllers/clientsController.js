import { criarCliente, buscarClientePorId } from "../services/clienteService.js";
import scrapeOlx from "../services/scrapers/olxScrapper.js";



export const criarClienteC = async (req, res) => {
try {
  const resultado = await criarCliente(req.body);

  if (resultado.success) {
    return res.status(201).json({ message: "Cliente cadastrado com sucesso!", cliente: resultado.cliente });
  }

} catch (error) {
  next(error)
}
 };


export const getClienteImoveis = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const cliente = await buscarClientePorId(clienteId);

    if (!cliente) {
      return res.status(404).json({ message: "❌ Cliente não encontrado" });
    }

    // Aqui poderia chamar um scraper, por exemplo
  //  const imoveis = await scrapeOlx(cliente);

    return res.status(200).json({ cliente, imoveis });
  } catch (error) {
    next(error);
  }
};