// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "reflect-metadata";
import { AppDataSource } from './config/database';

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

// Inicialización de la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos MySQL establecida");
  })
  .catch((error) => console.error("Error al conectar con la base de datos:", error));

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