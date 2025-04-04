import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

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

// Conexión a MySQL con Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string, 
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    logging: console.log
  }
);

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión a MySQL establecida correctamente'))
  .catch(err => console.error('Error conectando a MySQL:', err));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transferencias', transferenciaRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API de BanConsumir funcionando correctamente con MySQL');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;