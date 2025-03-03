import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: false },
  telefone: { type: String, required: false },
  valorMin: { type: Number, required: true },
  valorMax: { type: Number, required: true },
  modalidade: { type: String, required: true }, // Ex: "Compra" ou "Aluguel"
  bairros: { type: [String], required: true },
  dataCriacao: { type: Date, default: Date.now },
});

export default mongoose.model("Cliente", ClienteSchema);
