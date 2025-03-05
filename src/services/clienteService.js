import Cliente from "../models/cliente.js";
import User from "../models/user.js"
import ImovelEnviado from "../models/imovel.js";
import sendWhatsApp from "../utils/sendWhatsapp.js";
import scrapeOlx from "../scrapper/olxScrapper.js";



export const createAClient = async (userId, dadosCliente) => {
  try {
    const cliente = new Cliente(dadosCliente);
    await cliente.save();


    console.log(cliente.id)
    // Adiciona o cliente ao usuário
    const updateResult = await findByIdAndUpdate(userId, { $push: { clientes: cliente._id } });

    return { success: true, cliente };
  } catch (error) {
    return { success: false, error };
  }
};


export const scrapeAndSendDaily = async (cliente) => {
  console.log(`📢 Buscando imóveis para ${cliente.email}...`);
  
  // 1️⃣ Faz o scraping dos imóveis
  const novosImoveis = await scrapeOlx(cliente);
  
  // 2️⃣ Pega os links que já foram enviados para esse cliente
  const linksEnviados = await ImovelEnviado.find({ clienteId: cliente._id }).distinct("link");

  // 3️⃣ Filtra apenas os imóveis que ainda não foram enviados
  //const imoveisFrescos = novosImoveis.filter(imovel => !linksEnviados.includes(imovel.link));

  //if (imoveisFrescos.length > 0) {
    // 4️⃣ Envia os novos imóveis para o cliente
    await sendWhatsApp("Novos imóveis disponíveis!", linksEnviados.slice(0, 3));

    // 5️⃣ Salva os links dos imóveis enviados no banco
    // await ImovelEnviado.insertMany(
    //   imoveisFrescos.map(imovel => ({
    //     link: imovel.link,
    //     clienteId: cliente._id,
    //   }))
    // );

//    console.log(`✅ ${imoveisFrescos.length} imóveis enviados para ${cliente.email}`);
//  } else {
 //   console.log(`❌ Nenhum imóvel novo para ${cliente.email} hoje.`);
 // }
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

export const findByIdAndUpdate = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, useFindAndModify: false }
    );
    
    if (!updatedUser) {
      return { success: false, message: "Usuário não encontrado" };
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error };
  }
};


export const searchClientsByUserId = async (userId) => {
  try {
    // Busca o usuário pelo ID e popula a lista de clientes associados a ele
    const user = await User.findById(userId).populate("clientes");

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    return { success: true, clientes: user.clientes };
  } catch (error) {
    return { success: false, error: "Erro ao buscar clientes do usuário" };
  }
};
