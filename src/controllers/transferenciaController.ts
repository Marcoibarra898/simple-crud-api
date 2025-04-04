import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Transferencia } from '../models/Transferencia';
import { Cuenta } from '../models/Cuenta'; 

const transferenciaRepository = AppDataSource.getRepository(Transferencia);
const cuentaRepository = AppDataSource.getRepository(Cuenta);

// Obtener todas las transferencias
export const getTransferencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const transferencias = await transferenciaRepository.find({
      relations: ["cuentaOrigen", "cuentaDestino"]
    });
    
    res.status(200).json(transferencias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener transferencias", error });
  }
};

// Obtener una transferencia por ID
export const getTransferenciaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const transferencia = await transferenciaRepository.findOne({
      where: { id },
      relations: ["cuentaOrigen", "cuentaDestino"]
    });
    
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
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    const { cuentaOrigenId, cuentaDestinoId, monto, concepto } = req.body;
    
    // Verificar cuentas
    const origen = await cuentaRepository.findOneBy({ id: cuentaOrigenId });
    const destino = await cuentaRepository.findOneBy({ id: cuentaDestinoId });
    
    if (!origen || !destino) {
      await queryRunner.rollbackTransaction();
      res.status(404).json({ message: "Cuenta de origen o destino no encontrada" });
      return;
    }
    
    // Verificar saldo suficiente
    if (origen.saldo < monto) {
      await queryRunner.rollbackTransaction();
      res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia" });
      return;
    }
    
    // Crear transferencia
    const nuevaTransferencia = transferenciaRepository.create({
      cuentaOrigenId,
      cuentaDestinoId,
      monto,
      concepto,
      estado: 'Completada'
    });
    
    // Actualizar saldos
    origen.saldo -= monto;
    destino.saldo += monto;
    
    await queryRunner.manager.save(origen);
    await queryRunner.manager.save(destino);
    const transferenciaGuardada = await queryRunner.manager.save(nuevaTransferencia);
    
    await queryRunner.commitTransaction();
    
    res.status(201).json(transferenciaGuardada);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    res.status(400).json({ message: "Error al crear transferencia", error });
  } finally {
    await queryRunner.release();
  }
};

// Actualizar una transferencia
export const actualizarTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    // Solo permitimos actualizar el concepto y el estado
    const { concepto, estado } = req.body;
    const actualizacion = { concepto, estado };
    
    const transferencia = await transferenciaRepository.findOneBy({ id });
    
    if (!transferencia) {
      res.status(404).json({ message: "Transferencia no encontrada" });
      return;
    }
    
    transferenciaRepository.merge(transferencia, actualizacion);
    const resultado = await transferenciaRepository.save(transferencia);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar transferencia", error });
  }
};

// Eliminar una transferencia
export const eliminarTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await transferenciaRepository.delete(id);
    
    if (resultado.affected === 0) {
      res.status(404).json({ message: "Transferencia no encontrada" });
      return;
    }
    
    res.status(200).json({ message: "Transferencia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar transferencia", error });
  }
};