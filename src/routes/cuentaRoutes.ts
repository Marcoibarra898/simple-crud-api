import { Router } from 'express';
import { 
  getCuentas, 
  getCuentaById, 
  createCuenta, 
  updateCuenta, 
  deleteCuenta 
} from 'src\controllers\cuentaController.ts';

const router = Router();

router.get('/', getCuentas);
router.get('/:id', getCuentaById);
router.post('/', createCuenta);
router.patch('/:id', updateCuenta);
router.delete('/:id', deleteCuenta);

export default router;