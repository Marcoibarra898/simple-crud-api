import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './connection/connection';

// Importar rutas
import usuarioRoutes from './routes/usuarioRoutes';
import cuentaRoutes from './routes/cuentaRoutes';
import transferenciaRoutes from './routes/transferenciaRoutes';
// Importar otras rutas si existen (por ejemplo, productRoutes)

// Configurar variables de entorno
dotenv.config();

// Crear servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probar conexión a la base de datos
testConnection();

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/cuentas', cuentaRoutes);
app.use('/transferencias', transferenciaRoutes);
// Otras rutas
// app.use('/productos', productRoutes); 

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API REST funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});