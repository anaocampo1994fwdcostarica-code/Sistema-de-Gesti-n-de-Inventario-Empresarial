const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bodegaRoutes = require('./routes/bodegaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const existenciaRoutes = require('./routes/existenciaRoutes');
const movimientoInventarioRoutes = require('./routes/movimientoInventarioRoutes');
const compraRoutes = require('./routes/compraRoutes');
const detalleCompraRoutes = require('./routes/detalleCompraRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const detalleVentaRoutes = require('./routes/detalleVentaRoutes');
const ajusteInventarioRoutes = require('./routes/ajusteInventarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const tipoMovimientoRoutes = require('./routes/tipoMovimientoRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const { assertJwtConfig } = require('./config/jwt');

assertJwtConfig();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS.'));
  },
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', authenticate, usuarioRoutes);
app.use('/api/categorias', authenticate, categoriaRoutes);
app.use('/api/proveedores', authenticate, proveedorRoutes);
app.use('/api/productos', authenticate, productoRoutes);
app.use('/api/bodegas', authenticate, bodegaRoutes);
app.use('/api/tipos-movimiento', authenticate, tipoMovimientoRoutes);
app.use('/api/clientes', authenticate, clienteRoutes);
app.use('/api/ubicaciones', authenticate, ubicacionRoutes);
app.use('/api/existencias', authenticate, existenciaRoutes);
app.use('/api/movimientos-inventario', authenticate, movimientoInventarioRoutes);
app.use('/api/compras', authenticate, compraRoutes);
app.use('/api/detalles-compras', authenticate, detalleCompraRoutes);
app.use('/api/ventas', authenticate, ventaRoutes);
app.use('/api/detalles-ventas', authenticate, detalleVentaRoutes);
app.use('/api/ajustes-inventario', authenticate, ajusteInventarioRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use(errorHandler);

module.exports = app;
