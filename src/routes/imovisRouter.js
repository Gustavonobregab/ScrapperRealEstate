import express from "express";
import { fetchImoveis } from "../controllers/imoveisController";


const router = express.Router();

router.post("/imoveis", fetchImoveis);

export default router;
