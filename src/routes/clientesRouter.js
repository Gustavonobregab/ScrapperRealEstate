import express from "express";
import { criarCliente, buscarImoveis } from "../controllers/clientsController.js";

const router = express.Router();

router.post("/clientes", criarCliente);
router.get("/clientes/imoveis", buscarImoveis);

export default router;
