import express from 'express';
import { 
  getUsuarios, 
  getUsuarioPorId, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../controllers/usuarioController';

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', getUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', getUsuarioPorId);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', crearUsuario);

// PATCH /api/usuarios/:id - Actualizar un usuario
router.patch('/:id', actualizarUsuario);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', eliminarUsuario);

export default router;