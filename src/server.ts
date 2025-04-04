import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar rutas
import usuarioRoutes from './routes/usuarioRoutes';
import cuentaRoutes from './routes/cuentaRoutes';
import transferenciaRoutes from './routes/transferenciaRoutes';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transferencias', transferenciaRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API de BanConsumir funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;