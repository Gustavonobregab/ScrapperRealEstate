import express from "express";
import { createClient , getClientImoveis, getUserClientes, getAllClients, getDailyClientImoveis, removeClient } from "../controllers/clientsController.js";

const router = express.Router();

router.post("/createCliente/:userId", createClient);
router.get("/clientes",  getAllClients );
router.get("/:clienteId/imoveis", getClientImoveis);
router.get("/:clienteId/dailyImoveis", getDailyClientImoveis);
router.get("/clientes/:id", getUserClientes);
router.delete("/clientes/:clienteId", removeClient);


export default router;
