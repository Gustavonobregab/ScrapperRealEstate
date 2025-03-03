import Cliente from "../models/cliente.js";

export const createAClient = async (dadosCliente) => {
  try {
    const cliente = new Cliente(dadosCliente);
    await cliente.save();
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};

export const searchClientById = async (id) => {
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return { success: false, message: "Cliente não encontrado" };
    }
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};


export const searchAllClients = async () => {
  try {
    return await Cliente.find();
  } catch (error) {
    throw new Error("Erro ao buscar clientes");
  }
};