import mongoose from "mongoose";

const ImovelEnviadoSchema = new mongoose.Schema({
  link: { type: String, unique: false }, // Evita duplicação
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  enviadoEm: { type: Date, default: Date.now },
});
ImovelEnviadoSchema.index({ link: 1, clienteId: 1 }, { unique: true });


const ImovelEnviado = mongoose.model("ImovelEnviado", ImovelEnviadoSchema);


export default ImovelEnviado;
