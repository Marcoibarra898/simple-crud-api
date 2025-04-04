import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cuenta } from '../models/Cuenta';

const cuentaRepository = AppDataSource.getRepository(Cuenta);

// Obtener todas las cuentas
export const getCuentas = async (req: Request, res: Response): Promise<void> => {
  try {
    const cuentas = await cuentaRepository.find({
      relations: ["usuario"]
    });
    res.status(200).json(cuentas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cuentas", error });
  }
};

// Obtener una cuenta por ID
export const getCuentaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const cuenta = await cuentaRepository.findOne({
      where: { id },
      relations: ["usuario"]
    });
    
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
    const nuevaCuenta = cuentaRepository.create(req.body);
    const resultado = await cuentaRepository.save(nuevaCuenta);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear cuenta", error });
  }
};

// Actualizar una cuenta
export const actualizarCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const cuenta = await cuentaRepository.findOneBy({ id });
    
    if (!cuenta) {
      res.status(404).json({ message: "Cuenta no encontrada" });
      return;
    }
    
    cuentaRepository.merge(cuenta, req.body);
    const resultado = await cuentaRepository.save(cuenta);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar cuenta", error });
  }
};

// Eliminar una cuenta
export const eliminarCuenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await cuentaRepository.delete(id);
    
    if (resultado.affected === 0) {
      res.status(404).json({ message: "Cuenta no encontrada" });
      return;
    }
    
    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cuenta", error });
  }
};