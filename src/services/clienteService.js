import Cliente from "../models/cliente.js";

export const criarCliente = async (dadosCliente) => {
  try {
    const cliente = new Cliente(dadosCliente);
    await cliente.save();
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};

export const buscarClientePorId = async (id) => {
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return { success: false, message: "❌ Cliente não encontrado" };
    }
    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};
