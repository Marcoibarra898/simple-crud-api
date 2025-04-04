import { Router } from 'express';
import { 
  getTransferencias, 
  getTransferenciaById, 
  createTransferencia, 
  updateTransferencia, 
  deleteTransferencia 
} from '../Controllers/transferenciaControllers';

const router = Router();

router.get('/', getTransferencias);
router.get('/:id', getTransferenciaById);
router.post('/', createTransferencia);
router.patch('/:id', updateTransferencia);
router.delete('/:id', deleteTransferencia);

export default router;