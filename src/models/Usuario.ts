// src/models/Usuario.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
}

const UsuarioSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);