import express from "express";
import { fetchAllImoveis } from "../controllers/imoveisController.js";


const router = express.Router();

router.get("/imoveis", fetchAllImoveis);

export default router;
