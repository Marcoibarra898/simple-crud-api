import { Request, Response } from 'express';
import { executeQuery } from '../connection/connection';

// Obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await executeQuery('SELECT * FROM usuarios');
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
    
    if (!usuario || (Array.isArray(usuario) && usuario.length === 0)) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    res.status(200).json(Array.isArray(usuario) ? usuario[0] : usuario);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, email, password } = req.body;
    
    // Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }
    
    const result = await executeQuery(
      'INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
      [nombre, apellido, email, password]
    );
    
    const nuevoUsuarioId = (result as any).insertId;
    const nuevoUsuario = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [nuevoUsuarioId]);
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: Array.isArray(nuevoUsuario) ? nuevoUsuario[0] : nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password } = req.body;
    
    // Verificar si el usuario existe
    const usuarioExistente = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
    
    if (!usuarioExistente || (Array.isArray(usuarioExistente) && usuarioExistente.length === 0)) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    // Construir la consulta dinámicamente basada en los campos proporcionados
    const updateFields: string[] = [];
    const values: any[] = [];
    
    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      values.push(nombre);
    }
    
    if (apellido !== undefined) {
      updateFields.push('apellido = ?');
      values.push(apellido);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      values.push(email);
    }
    
    if (password !== undefined) {
      updateFields.push('password = ?');
      values.push(password);
    }
    
    // Si no hay campos para actualizar
    if (updateFields.length === 0) {
      res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
      return;
    }
    
    // Añadir el ID al final de los valores
    values.push(id);
    
    await executeQuery(
      `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    const usuarioActualizado = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
    
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      usuario: Array.isArray(usuarioActualizado) ? usuarioActualizado[0] : usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const usuarioExistente = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
    
    if (!usuarioExistente || (Array.isArray(usuarioExistente) && usuarioExistente.length === 0)) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    await executeQuery('DELETE FROM usuarios WHERE id = ?', [id]);
    
    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      id
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};