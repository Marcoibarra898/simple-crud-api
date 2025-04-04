import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../models/Usuario';

const usuarioRepository = AppDataSource.getRepository(Usuario);

// Obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await usuarioRepository.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Obtener un usuario por ID
export const getUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await usuarioRepository.findOneBy({ id });
    
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoUsuario = usuarioRepository.create(req.body);
    const resultado = await usuarioRepository.save(nuevoUsuario);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
};

// Actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await usuarioRepository.findOneBy({ id });
    
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    
    usuarioRepository.merge(usuario, req.body);
    const resultado = await usuarioRepository.save(usuario);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error });
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await usuarioRepository.delete(id);
    
    if (resultado.affected === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};