import { Request, Response } from 'express';
import Cuenta, { ICuenta } from '../models/Cuenta';

// Obtener todas las cuentas
export const getCuentas = async (req: Request, res: Response): Promise<void> => {
  try {
    const cuentas = await Cuenta.find().populate('usuario', 'nombre apellido');
    res.status(200).json(cuentas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cuentas", error });
  }
};

// Obtener una cuenta por ID
export const getCuentaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const cuenta = await Cuenta.findById(req.params.id).populate('usuario', 'nombre apellido');
    
    if (!cuenta) {
      res.status(404).json({ message: "Cuenta no encontrada" });
      return;
    }
    
    res.status(200).json(cuenta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la cuenta", error });
  }
};

// Crear una nueva cuenta
export const crearCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevaCuenta = new Cuenta(req.body);
    const cuentaGuardada = await nuevaCuenta.save();
    res.status(201).json(cuentaGuardada);
    } catch (error) {
    res.status(400).json({ message: "Error al crear cuenta", error });
    }
};

// Actualizar una cuenta
export const actualizarCuenta = async (req: Request, res: Response): Promise<void> => {
try {
const cuentaActualizada = await Cuenta.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);

if (!cuentaActualizada) {
  res.status(404).json({ message: "Cuenta no encontrada" });
  return;
}

res.status(200).json(cuentaActualizada);
} catch (error) {
res.status(400).json({ message: "Error al actualizar cuenta", error });
}
};

// Eliminar una cuenta
export const eliminarCuenta = async (req: Request, res: Response): Promise<void> => {
try {
const cuentaEliminada = await Cuenta.findByIdAndDelete(req.params.id);

if (!cuentaEliminada) {
  res.status(404).json({ message: "Cuenta no encontrada" });
  return;
}

res.status(200).json({ message: "Cuenta eliminada correctamente" });
} catch (error) {
res.status(500).json({ message: "Error al eliminar cuenta", error });
}
};