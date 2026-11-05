# Reporte técnico verificable

Fecha de verificación: 5 de noviembre de 2026.

## Resumen

| Requisito | Resultado | Fuente verificable |
|---|---:|---|
| Tablas empresariales | 15 | `backend/models` y 17 migraciones |
| Modelos Sequelize | 15 | `backend/models`, excluyendo `index.js` |
| Controladores de entidades | 15 | `backend/controllers/*Controller.js`, excluyendo autenticación y fábricas |
| Migraciones | 17 | `backend/migrations` |
| Claves foráneas | 24 | Migraciones de creación y diagrama ER |
| Rutas empresariales protegidas | 15 grupos | `backend/app.js`, líneas de montaje con `authenticate` |
| Solicitudes Postman | 80 | Colección v2.1 válida |
| Pruebas automatizadas | 30 aprobadas | Node.js Test Runner sobre base aislada |

## 15 tablas y modelos

1. `usuarios` — `backend/models/usuario.js`
2. `categorias` — `backend/models/categoria.js`
3. `proveedores` — `backend/models/proveedor.js`
4. `productos` — `backend/models/producto.js`
5. `bodegas` — `backend/models/bodega.js`
6. `ubicaciones` — `backend/models/ubicacion.js`
7. `existencias` — `backend/models/existencia.js`
8. `tipos_movimiento` — `backend/models/tipoMovimiento.js`
9. `movimientos_inventario` — `backend/models/movimientoInventario.js`
10. `clientes` — `backend/models/cliente.js`
11. `compras` — `backend/models/compra.js`
12. `detalles_compras` — `backend/models/detalleCompra.js`
13. `ventas` — `backend/models/venta.js`
14. `detalles_ventas` — `backend/models/detalleVenta.js`
15. `ajustes_inventario` — `backend/models/ajusteInventario.js`

Comando de comprobación:

```powershell
(Get-ChildItem backend/models/*.js |
  Where-Object Name -ne 'index.js').Count
```

Resultado observado: **15**.

## 15 controladores de entidades

`usuarioController`, `categoriaController`, `proveedorController`,
`productoController`, `bodegaController`, `ubicacionController`,
`existenciaController`, `tipoMovimientoController`,
`movimientoInventarioController`, `clienteController`,
`compraController`, `detalleCompraController`, `ventaController`,
`detalleVentaController` y `ajusteInventarioController`.

No se cuentan `authController`, `documentoControllerFactory` ni
`detalleControllerFactory`, porque no representan entidades adicionales.

Resultado observado: **15 controladores de entidades**.

## Migraciones

La carpeta `backend/migrations` contiene **17 archivos**:

- 15 migraciones que crean las tablas empresariales;
- una migración que agrega `activo` a usuarios;
- una migración idempotente de tipos de movimiento técnicos.

No se ejecutó ninguna migración sobre la base principal durante la preparación
de estas evidencias.

## 24 claves foráneas

| Tabla hija | Referencias |
|---|---|
| productos | categorias, proveedores |
| ubicaciones | bodegas |
| existencias | productos, ubicaciones |
| movimientos_inventario | productos, tipos_movimiento, ubicación origen, ubicación destino, usuarios |
| compras | proveedores, usuarios |
| detalles_compras | compras, productos, ubicaciones |
| ventas | clientes, usuarios |
| detalles_ventas | ventas, productos, ubicaciones |
| ajustes_inventario | productos, ubicaciones, usuarios, movimientos_inventario |

Suma: 2 + 1 + 2 + 5 + 2 + 3 + 2 + 3 + 4 = **24**.

El archivo editable `docs/diagrama-er.drawio` contiene exactamente 15 nodos de
entidad y 24 conectores de relación. Su XML fue validado correctamente.

## Protección JWT

`backend/app.js` aplica `authenticate` a:

- `/api/usuarios`
- `/api/categorias`
- `/api/proveedores`
- `/api/productos`
- `/api/bodegas`
- `/api/tipos-movimiento`
- `/api/clientes`
- `/api/ubicaciones`
- `/api/existencias`
- `/api/movimientos-inventario`
- `/api/compras`
- `/api/detalles-compras`
- `/api/ventas`
- `/api/detalles-ventas`
- `/api/ajustes-inventario`

Las únicas operaciones públicas de autenticación son registro y login.
`GET /api/auth/me` aplica su propio middleware JWT.

## Suite automatizada

- Herramienta: Node.js Test Runner.
- Archivo: `backend/test/integration.test.js`.
- Lanzador seguro: `backend/test/run-tests.js`.
- Casos: 30.
- Base exclusiva: `inventario_empresarial_test`.
- Resultado de esta ejecución: 30 aprobados y 0 fallidos.

La guarda de aislamiento rechaza la base principal, exige el sufijo `_test` y
genera en memoria el secreto JWT y la contraseña temporal.

## Colección Postman

Archivo:
`docs/postman/Inventario_Empresarial.postman_collection.json`.

- Esquema: Collection v2.1.
- Carpetas: 16.
- Solicitudes: 80.
- Variables: `baseUrl` y `token`.
- Incluye confirmación idempotente de compras y ventas.
- Documenta respuestas 403 y 409 de operaciones restringidas.
- No contiene credenciales reales.

## Comandos de verificación estática

```powershell
(Get-ChildItem backend/models/*.js | Where-Object Name -ne 'index.js').Count
(Get-ChildItem backend/migrations/*.js).Count
Get-Content docs/postman/Inventario_Empresarial.postman_collection.json -Raw |
  ConvertFrom-Json
rg "app\.use\('/api/|authenticate" backend/app.js
```

Este reporte no contiene contraseñas, JWT, hashes ni valores reales de archivos
de entorno.

