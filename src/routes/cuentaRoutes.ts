import { Router } from 'express';
import { 
  getCuentas, 
  getCuentaById, 
  createCuenta, 
  updateCuenta, 
  deleteCuenta 
} from './Controllers/cuentaController';

const router = Router();

router.get('/', getCuentas);
router.get('/:id', getCuentaById);
router.post('/', createCuenta);
router.patch('/:id', updateCuenta);
router.delete('/:id', deleteCuenta);

export default router;