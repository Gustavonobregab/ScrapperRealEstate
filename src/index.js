import express from "express";
import connectDB from "./config/database.js";
import router from "./routes/imoveisRouter.js";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();

// Criando a aplicação Express
const app = express();
app.use(express.json());
app.use("/api", router); 
app.use(errorMiddleware);

// Conectando ao MongoDB
//connectDB();

// Definindo a porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
