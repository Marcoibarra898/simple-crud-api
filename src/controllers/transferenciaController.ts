import { Request, Response } from 'express';
import Transferencia, { ITransferencia } from '../models/Transferencia';
import Cuenta from '../models/Cuenta';
import mongoose from 'mongoose';

// Obtener todas las transferencias
export const getTransferencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const transferencias = await Transferencia.find()
      .populate('cuentaOrigen', 'numeroCuenta banco')
      .populate('cuentaDestino', 'numeroCuenta banco');
    
    res.status(200).json(transferencias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener transferencias", error });
  }
};

// Obtener una transferencia por ID
export const getTransferenciaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const transferencia = await Transferencia.findById(req.params.id)
      .populate('cuentaOrigen', 'numeroCuenta banco')
      .populate('cuentaDestino', 'numeroCuenta banco');
    
    if (!transferencia) {
      res.status(404).json({ message: "Transferencia no encontrada" });
      return;
    }
    
    res.status(200).json(transferencia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transferencia", error });
  }
};

// Crear una nueva transferencia
export const crearTransferencia = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { cuentaOrigen, cuentaDestino, monto, concepto } = req.body;
    
    // Verificar cuentas
    const origen = await Cuenta.findById(cuentaOrigen);
    const destino = await Cuenta.findById(cuentaDestino);
    
    if (!origen || !destino) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Cuenta de origen o destino no encontrada" });
      return;
    }
    
    // Verificar saldo suficiente
    if (origen.saldo < monto) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia" });
      return;
    }
    
    // Crear transferencia
    const nuevaTransferencia = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      concepto,
      estado: 'Completada'
    });
    
    // Actualizar saldos
    origen.saldo -= monto;
    destino.saldo += monto;
    
    await origen.save({ session });
    await destino.save({ session });
    const transferenciaGuardada = await nuevaTransferencia.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(transferenciaGuardada);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Error al crear transferencia", error });
  }
};

// Actualizar una transferencia
export const actualizarTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    // Solo permitimos actualizar el concepto y el estado
    const { concepto, estado } = req.body;
    const actualizacion = { concepto, estado };
    
    const transferenciaActualizada = await Transferencia.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true }
    );
    
    if (!transferenciaActualizada) {
      res.status(404).json({ message: "Transferencia no encontrada" });
      return;
    }
    
    res.status(200).json(transferenciaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar transferencia", error });
  }
};

// Eliminar una transferencia
export const eliminarTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const transferenciaEliminada = await Transferencia.findByIdAndDelete(req.params.id);
    
    if (!transferenciaEliminada) {
      res.status(404).json({ message: "Transferencia no encontrada" });
      return;
    }
    
    res.status(200).json({ message: "Transferencia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar transferencia", error });
  }
};