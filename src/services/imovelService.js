

export const searchImoveis = async (id) => {
    try {
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return { success: false, message: "❌ Cliente não encontrado" };
      }
      return { success: true, cliente };
    } catch (error) {
      return { success: false, error };
    }}