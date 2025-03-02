import express from "express";
import { criarClienteC, getClienteImoveis } from "../controllers/clientsController.js";

const router = express.Router();

router.post("/clientes", criarClienteC);
router.get("/:clienteId/imoveis", getClienteImoveis);


export default router;
