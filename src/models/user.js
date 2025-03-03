import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }],
    cpf: { type: String, required: true, unique: true },
    dataCriacao: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("User", UserSchema);
  