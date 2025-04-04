import express from 'express';
import { 
  getCuentas, 
  getCuentaPorId, 
  crearCuenta, 
  actualizarCuenta, 
  eliminarCuenta 
} from '../controllers/cuentaController';

const router = express.Router();

// GET /api/cuentas - Obtener todas las cuentas
router.get('/', getCuentas);

// GET /api/cuentas/:id - Obtener una cuenta por ID
router.get('/:id', getCuentaPorId);

// POST /api/cuentas - Crear una nueva cuenta
router.post('/', crearCuenta);

// PATCH /api/cuentas/:id - Actualizar una cuenta
router.patch('/:id', actualizarCuenta);

// DELETE /api/cuentas/:id - Eliminar una cuenta
router.delete('/:id', eliminarCuenta);

export default router;