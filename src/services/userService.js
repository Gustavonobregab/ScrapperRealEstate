import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    const usuario = new User({ ...userData, senha: hashedPassword });
    await usuario.save();
    return { success: true, usuario };
  } catch (error) {
    return { success: false, error };
  }
};

export const authenticateUser = async ({ email, senha }) => {
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return { success: false };

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return { success: false };

    const token = jwt.sign({ id: usuario._id }, "secret_key", { expiresIn: "1h" });
    return { success: true, token };
  } catch (error) {
    return { success: false, error };
  }
};

export const fetchAllUsers = async () => {
  try {
    const users = await User.find();
    console.log("✅ Usuários encontrados:", users);
    return users;
  } catch (error) {
    console.error("❌ Erro detalhado ao buscar usuários:", error);
    throw new Error("Erro ao buscar usuários");
  }
};



export const findByIdAndUpdate = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return { success: false, message: "Usuário não encontrado." };
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const removeUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};