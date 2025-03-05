import mongoose from "mongoose";
import { config } from "../config/config.js";  // Importando as configurações
import { fetchAllUsers } from "../services/userService.js";
import { searchClientsByUserId } from "../services/clienteService.js";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout de 10 segundos
    });
    console.log("✅ Conectado ao MongoDB");
  } catch (error) {
    console.error("❌ Erro na conexão com o MongoDB:", error);
  }
};

const runScraping = async () => {
  await connectToMongoDB();

  try {
    const users = await fetchAllUsers();
    console.log(users);

    for (const user of users) {
        console.log(`👤 Buscando clientes de ${user.email}...`);
        const clientes = await searchClientsByUserId(user._id);
        console.log(clientes)
        
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
  } finally {
    mongoose.connection.close();
  }
};

runScraping();
