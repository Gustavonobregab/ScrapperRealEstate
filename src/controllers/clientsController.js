import { createAClient, searchClientById, searchAllClients, scrapeAndSendDaily } from "../services/clienteService.js";
import scrapeOlx from "../services/scrapers/olxScrapper.js";

export const createClient = async (req, res, next) => {
  try {
    const userId = req.params.userId; 
    if (!userId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório." });
    }

    const newClient = await createAClient(userId, req.body);

    if (!newClient.success) {
      throw newClient.error;
    }

    return res.status(201).json({ message: "Cliente criado com sucesso!", cliente: newClient.cliente });
  } catch (error) {
    next(error)
  }
};

export const getClientImoveis = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const cliente = await searchClientById(clienteId);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Aqui poderia chamar um scraper, por exemplo
     const imoveis = await scrapeOlx(cliente.cliente);

    return res.status(200).json({ cliente, imoveis  });
  } catch (error) {
    next(error);
  }
};

export const getDailyClientImoveis = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const cliente = await searchClientById(clienteId);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Aqui poderia chamar um scraper, por exemplo
     const imoveis = await scrapeAndSendDaily(cliente.cliente  );

    return res.status(200).json({ cliente, imoveis  });
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (req, res, next) => {
  try {
    const clientes = await searchAllClients();
    return res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};
