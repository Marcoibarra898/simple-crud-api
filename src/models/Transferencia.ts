// src/models/Transferencia.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ICuenta } from './Cuenta';

export interface ITransferencia extends Document {
  cuentaOrigen: ICuenta['_id'];
  cuentaDestino: ICuenta['_id'];
  monto: number;
  concepto: string;
  fecha: Date;
  estado: string;
}

const TransferenciaSchema: Schema = new Schema({
  cuentaOrigen: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true },
  cuentaDestino: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true },
  monto: { type: Number, required: true },
  concepto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, required: true, enum: ['Pendiente', 'Completada', 'Rechazada'], default: 'Pendiente' }
});

export default mongoose.model<ITransferencia>('Transferencia', TransferenciaSchema);
