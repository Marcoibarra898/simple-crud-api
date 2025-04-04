import { Router } from 'express';
import { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../Controllers/usuarioControllers';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.patch('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
