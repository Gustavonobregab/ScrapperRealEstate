import express from "express";
import { criarClienteC } from "../controllers/clientsController.js";

const router = express.Router();

router.post("/clientes", criarClienteC);

export default router;
