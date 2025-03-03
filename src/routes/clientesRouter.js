import express from "express";
import { createClient , getClientImoveis, getAllClients } from "../controllers/clientsController.js";

const router = express.Router();

router.post("/createCliente", createClient);
router.get("/clientes",  getAllClients );
router.get("/:clienteId/imoveis", getClientImoveis);

export default router;
