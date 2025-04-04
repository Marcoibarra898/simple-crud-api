import express from 'express';
import { 
  getTransferencias, 
  getTransferenciaPorId, 
  crearTransferencia, 
  actualizarTransferencia, 
  eliminarTransferencia 
} from '../controllers/transferenciaController';

const router = express.Router();

// GET /api/transferencias - Obtener todas las transferencias
router.get('/', getTransferencias);

// GET /api/transferencias/:id - Obtener una transferencia por ID
router.get('/:id', getTransferenciaPorId);

// POST /api/transferencias - Crear una nueva transferencia
router.post('/', crearTransferencia);

// PATCH /api/transferencias/:id - Actualizar una transferencia
router.patch('/:id', actualizarTransferencia);

// DELETE /api/transferencias/:id - Eliminar una transferencia
router.delete('/:id', eliminarTransferencia);

export default router;