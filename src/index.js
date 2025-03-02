import express from "express";
import connectDB from "./config/database.js";
import clienteRoutes from "./routes/clientesRouter.js";
import dotenv from "dotenv";

dotenv.config();

// Criando a aplicação Express
const app = express();
app.use(express.json());
app.use("/api", clienteRoutes);

// Conectando ao MongoDB
//connectDB();

// Definindo a porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
