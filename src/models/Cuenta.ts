// src/models/Cuenta.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IUsuario } from './Usuario';

export interface ICuenta extends Document {
  usuario: IUsuario['_id'];
  numeroCuenta: string;
  tipoCuenta: string;
  banco: string;
  saldo: number;
  activa: boolean;
}

const CuentaSchema: Schema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  numeroCuenta: { type: String, required: true, unique: true },
  tipoCuenta: { type: String, required: true, enum: ['Ahorro', 'Corriente'] },
  banco: { type: String, required: true },
  saldo: { type: Number, required: true, default: 0 },
  activa: { type: Boolean, default: true }
});

export default mongoose.model<ICuenta>('Cuenta', CuentaSchema);