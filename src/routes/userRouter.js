import express from "express";
import { registerUser, loginUser, getAllUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser); // Nova rota para deletar usuário

export default router;