import { createUser, authenticateUser, fetchAllUsers, removeUser } from "../services/userService.js";

export const  registerUser = async (req, res, next) => {
  try {
    const resultado = await createUser(req.body);
    if (resultado.success) {
      return res.status(201).json({ message: "Usuário cadastrado com sucesso!", usuario: resultado.usuario });
    }
    res.status(400).json({ message: "Erro ao cadastrar usuário", error: resultado.error });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const resultado = await authenticateUser(req.body);
    if (resultado.success) {
      return res.status(200).json({ message: "Login realizado com sucesso!", token: resultado.token });
    }
    res.status(401).json({ message: "Credenciais inválidas" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const usuarios = await fetchAllUsers();
    return res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await removeUser(userId);

    if (result.success) {
      return res.status(200).json({ message: "Usuário deletado com sucesso!" });
    }
    return res.status(404).json({ message: "Usuário não encontrado." });
  } catch (error) {
    next(error);
  }
};
