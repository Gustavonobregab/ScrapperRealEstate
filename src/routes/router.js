import express from "express";
import clientesRouter from "./clientesRouter.js";
import imoveisRouter from "./imoveisRouter.js";
//import emailRouter from "./emailRouter.js";

const router = express.Router();

router.use("/clientes", clientesRouter);
router.use("/imoveis", imoveisRouter);
//router.use("/email", emailRouter);

export default router;
