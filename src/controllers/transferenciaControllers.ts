import { Request, Response } from 'express';
import { executeQuery, pool } from '../connection/connection';

// Obtener todas las transferencias
export const getTransferencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const transferencias = await executeQuery(`
      SELECT t.*, 
             c1.numeroCuenta AS cuentaOrigenNumero, 
             c2.numeroCuenta AS cuentaDestinoNumero,
             u1.nombre AS nombreOrigen, 
             u1.apellido AS apellidoOrigen,
             u2.nombre AS nombreDestino, 
             u2.apellido AS apellidoDestino
      FROM transferencias t
      JOIN cuentas c1 ON t.cuentaOrigenId = c1.id
      JOIN cuentas c2 ON t.cuentaDestinoId = c2.id
      JOIN usuarios u1 ON c1.usuarioId = u1.id
      JOIN usuarios u2 ON c2.usuarioId = u2.id
      ORDER BY t.fecha DESC
    `);
    res.status(200).json(transferencias);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).json({ message: 'Error al obtener transferencias', error });
  }
};

// Obtener una transferencia por ID
export const getTransferenciaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transferencia = await executeQuery(`
      SELECT t.*, 
             c1.numeroCuenta AS cuentaOrigenNumero, 
             c2.numeroCuenta AS cuentaDestinoNumero,
             u1.nombre AS nombreOrigen, 
             u1.apellido AS apellidoOrigen,
             u2.nombre AS nombreDestino, 
             u2.apellido AS apellidoDestino
      FROM transferencias t
      JOIN cuentas c1 ON t.cuentaOrigenId = c1.id
      JOIN cuentas c2 ON t.cuentaDestinoId = c2.id
      JOIN usuarios u1 ON c1.usuarioId = u1.id
      JOIN usuarios u2 ON c2.usuarioId = u2.id
      WHERE t.id = ?
    `, [id]);
    
    if (!transferencia || (Array.isArray(transferencia) && transferencia.length === 0)) {
      res.status(404).json({ message: 'Transferencia no encontrada' });
      return;
    }
    
    res.status(200).json(Array.isArray(transferencia) ? transferencia[0] : transferencia);
  } catch (error) {
    console.error('Error al obtener transferencia por ID:', error);
    res.status(500).json({ message: 'Error al obtener transferencia', error });
  }
};

// Crear una nueva transferencia
export const createTransferencia = async (req: Request, res: Response): Promise<void> => {
  // Iniciar una transacción para garantizar la integridad de los datos
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { cuentaOrigenId, cuentaDestinoId, monto, descripcion = '' } = req.body;
    
    // Validaciones básicas
    if (!cuentaOrigenId || !cuentaDestinoId || !monto || monto <= 0) {
      res.status(400).json({ 
        message: 'cuentaOrigenId, cuentaDestinoId y monto (mayor a 0) son campos requeridos' 
      });
      return;
    }
    
    // Verificar que las cuentas existan
    const cuentaOrigen = await connection.query(
      'SELECT * FROM cuentas WHERE id = ?', 
      [cuentaOrigenId]
    );
    
    const cuentaDestino = await connection.query(
      'SELECT * FROM cuentas WHERE id = ?', 
      [cuentaDestinoId]
    );
    
    const cuentaOrigenData = (cuentaOrigen[0] as any[])[0];
    const cuentaDestinoData = (cuentaDestino[0] as any[])[0];
    
    if (!cuentaOrigenData) {
      await connection.rollback();
      res.status(404).json({ message: 'Cuenta origen no encontrada' });
      return;
    }
    
    if (!cuentaDestinoData) {
      await connection.rollback();
      res.status(404).json({ message: 'Cuenta destino no encontrada' });
      return;
    }
    
    // Verificar saldo suficiente
    if (cuentaOrigenData.saldo < monto) {
      await connection.rollback();
      res.status(400).json({ 
        message: 'Saldo insuficiente para realizar la transferencia',
        saldoActual: cuentaOrigenData.saldo,
        montoSolicitado: monto
      });
      return;
    }
    
    // Restar del origen
    await connection.query(
      'UPDATE cuentas SET saldo = saldo - ? WHERE id = ?',
      [monto, cuentaOrigenId]
    );
    
    // Sumar al destino
    await connection.query(
      'UPDATE cuentas SET saldo = saldo + ? WHERE id = ?',
      [monto, cuentaDestinoId]
    );
    
    // Registrar la transferencia
    const fecha = new Date();
    const [resultTransferencia] = await connection.query(
      'INSERT INTO transferencias (cuentaOrigenId, cuentaDestinoId, monto, fecha, descripcion) VALUES (?, ?, ?, ?, ?)',
      [cuentaOrigenId, cuentaDestinoId, monto, fecha, descripcion]
    );
    
    const transferenciaId = (resultTransferencia as any).insertId;
    
    // Commit de la transacción
    await connection.commit();
    
    // Obtener detalles de la transferencia realizada
    const nuevaTransferencia = await executeQuery(`
      SELECT t.*, 
             c1.numeroCuenta AS cuentaOrigenNumero, 
             c2.numeroCuenta AS cuentaDestinoNumero,
             u1.nombre AS nombreOrigen, 
             u1.apellido AS apellidoOrigen,
             u2.nombre AS nombreDestino, 
             u2.apellido AS apellidoDestino
      FROM transferencias t
      JOIN cuentas c1 ON t.cuentaOrigenId = c1.id
      JOIN cuentas c2 ON t.cuentaDestinoId = c2.id
      JOIN usuarios u1 ON c1.usuarioId = u1.id
      JOIN usuarios u2 ON c2.usuarioId = u2.id
      WHERE t.id = ?
    `, [transferenciaId]);
    
    res.status(201).json({
      message: 'Transferencia realizada exitosamente',
      transferencia: Array.isArray(nuevaTransferencia) ? nuevaTransferencia[0] : nuevaTransferencia
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear transferencia:', error);
    res.status(500).json({ message: 'Error al crear transferencia', error });
  } finally {
    connection.release();
  }
};

// Las transferencias generalmente no se actualizan, pero podríamos permitir actualizar la descripción
export const updateTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    
    if (!descripcion) {
      res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
      return;
    }
    
    // Verificar si la transferencia existe
    const transferenciaExistente = await executeQuery('SELECT * FROM transferencias WHERE id = ?', [id]);
    
    if (!transferenciaExistente || (Array.isArray(transferenciaExistente) && transferenciaExistente.length === 0)) {
      res.status(404).json({ message: 'Transferencia no encontrada' });
      return;
    }
    
    await executeQuery(
      'UPDATE transferencias SET descripcion = ? WHERE id = ?',
      [descripcion, id]
    );
    
    const transferenciaActualizada = await executeQuery(`
      SELECT t.*, 
             c1.numeroCuenta AS cuentaOrigenNumero, 
             c2.numeroCuenta AS cuentaDestinoNumero
      FROM transferencias t
      JOIN cuentas c1 ON t.cuentaOrigenId = c1.id
      JOIN cuentas c2 ON t.cuentaDestinoId = c2.id
      WHERE t.id = ?
    `, [id]);
    
    res.status(200).json({
      message: 'Descripción de transferencia actualizada exitosamente',
      transferencia: Array.isArray(transferenciaActualizada) ? transferenciaActualizada[0] : transferenciaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar transferencia:', error);
    res.status(500).json({ message: 'Error al actualizar transferencia', error });
  }
};

// Eliminar una transferencia (esto generalmente no debería permitirse en un sistema financiero real)
export const deleteTransferencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Verificar si la transferencia existe
    const transferenciaExistente = await executeQuery('SELECT * FROM transferencias WHERE id = ?', [id]);
    
    if (!transferenciaExistente || (Array.isArray(transferenciaExistente) && transferenciaExistente.length === 0)) {
      res.status(404).json({ message: 'Transferencia no encontrada' });
      return;
    }
    
    await executeQuery('DELETE FROM transferencias WHERE id = ?', [id]);
    
    res.status(200).json({
      message: 'Transferencia eliminada exitosamente',
      id
    });
  } catch (error) {
    console.error('Error al eliminar transferencia:', error);
    res.status(500).json({ message: 'Error al eliminar transferencia', error });
  }
};