import mongoose from "mongoose";

const ImovelEnviadoSchema = new mongoose.Schema({
  link: { type: String, unique: true }, // Evita duplicação
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  enviadoEm: { type: Date, default: Date.now },
});

const ImovelEnviado = mongoose.model("ImovelEnviado", ImovelEnviadoSchema);

export default ImovelEnviado;
