import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import { config } from "./config/config.js";

dotenv.config();

// Criando a aplicação Express
const app = express();
app.use(express.json());
app.use("/api", router); 
app.use(errorMiddleware);


// Conectando ao MongoDB
mongoose
  .connect(config.mongo.url)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  });


// Definindo a porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
