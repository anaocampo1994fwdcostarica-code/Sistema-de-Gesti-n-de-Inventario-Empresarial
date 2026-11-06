# Sistema de Gestión de Inventario Empresarial

## 1. Nombre y descripción

Sistema web full stack para administrar catálogos, bodegas, existencias y operaciones de inventario. Integra una API REST en Node.js y Express, persistencia MySQL mediante Sequelize y una interfaz React protegida con JWT. Evolucionó desde un CRUD de categorías, proveedores y productos hasta una solución con 15 entidades, compras, ventas, ajustes y movimientos trazables.

## 2. Problema empresarial

El control manual o disperso dificulta conocer qué productos existen, dónde se almacenan y qué operación originó cada cambio. Puede producir duplicidad, inventario negativo, errores de compra o venta y pérdida de trazabilidad.

## 3. Justificación empresarial

Centralizar la información permite relacionar productos con categorías y proveedores, distribuir unidades entre ubicaciones físicas y conservar el historial de entradas, salidas y traslados. Las transacciones reducen estados parciales y protegen la consistencia. Véase [docs/justificacion.md](docs/justificacion.md).

## 4. Objetivo general

Desarrollar un sistema empresarial seguro que centralice productos y existencias, controle movimientos por ubicación y procese compras, ventas y ajustes con autenticación, integridad referencial, trazabilidad e idempotencia.

## 5. Objetivos específicos

- Administrar los catálogos de la operación.
- Ubicar inventario por bodega y posición física.
- Evitar cantidades negativas y cambios sin trazabilidad.
- Registrar al usuario responsable.
- Procesar documentos mediante transacciones.
- Proteger rutas privadas con JWT.
- Proporcionar una interfaz React operativa.
- Verificar las reglas mediante pruebas y Postman.

## 6. Alcance del Día 1

El Día 1 estableció `backend/`, `frontend/` y `docs/`; los modelos `categorias`, `proveedores` y `productos`; sus relaciones; 15 endpoints REST iniciales; la conexión React–Express y las primeras evidencias Postman.

Se conserva la documentación histórica:

- [docs/justificacion.md](docs/justificacion.md)
- [docs/diagrama-er.drawio](docs/diagrama-er.drawio)
- `docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx`

## 7. Ampliaciones implementadas en el Día 2

- Usuarios, registro, login y perfil.
- Hash bcrypt y JWT con expiración.
- Middleware Bearer y rutas React protegidas.
- Bodegas, ubicaciones, existencias, tipos y movimientos.
- Clientes, compras, detalles, ventas y ajustes.
- Idempotencia y servicios transaccionales.
- Suite de integración con 30 pruebas.
- Postman v2.1 con 93 solicitudes y casos 400, 401 y 404.

## 8. Arquitectura

```text
React/Vite :5173
    | Axios + Authorization: Bearer JWT
    v
Express :3004
    | rutas -> middleware -> controladores -> servicios
    v
Sequelize 6 -> MySQL
```

El backend separa transporte, validación, negocio y persistencia. Los servicios de inventario, documentos y ajustes concentran las operaciones atómicas.

## 9. Tecnologías

| Capa | Tecnologías verificadas |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Axios y CSS |
| Backend | Node.js, Express 5 y Sequelize 6 |
| Seguridad | jsonwebtoken 9, bcrypt 6 y CORS |
| Datos | MySQL, mysql2 y Sequelize CLI |
| Pruebas | Node.js Test Runner y `fetch` |
| Documentación | Markdown, Postman v2.1 y diagrams.net |

## 10. Estructura real

```text
inventario-empresarial/
|-- backend/
|   |-- config/ controllers/ middlewares/
|   |-- migrations/ models/ routes/ services/ test/
|   |-- app.js
|   +-- server.js
|-- frontend/
|   |-- public/
|   +-- src/
|       |-- assets/ components/ contexts/ hooks/
|       +-- pages/ services/ styles/
|-- docs/
|   |-- evidencias/ postman/
|   |-- arquitectura_integridad.md
|   |-- diagrama-er.drawio
|   |-- investigacion_jwt_dia_2.md
|   +-- justificacion.md
|-- PROYECTO.md
+-- README.md
```

## 11. Descripción de las 15 entidades

| # | Tabla | Atributos funcionales verificados |
|---:|---|---|
| 1 | `usuarios` | `nombre`, `correo` único, `passwordHash`, `activo`, `fechaCreacion`, `updatedAt` |
| 2 | `categorias` | `nombre` único, `descripcion` y marcas temporales |
| 3 | `proveedores` | `nombre`, `telefono`, `correo` y marcas temporales |
| 4 | `productos` | `nombre`, `codigo` único, `precio`, `cantidad`, `categoriaId` y `proveedorId` |
| 5 | `bodegas` | `nombre` único, `descripcion`, `direccion` y `activo` |
| 6 | `ubicaciones` | `bodegaId`, `codigo`, `nombre`, `pasillo`, `estante`, `nivel` y `activo` |
| 7 | `existencias` | `productoId`, `ubicacionId`, `cantidad` no negativa y `version` |
| 8 | `tipos_movimiento` | `codigo` y `nombre` únicos, `efecto` y `activo` |
| 9 | `movimientos_inventario` | producto, tipo, origen, destino, cantidad, motivo, referencia, usuario y fecha |
| 10 | `clientes` | nombre, documento único opcional, correo, teléfono, dirección y activo |
| 11 | `compras` | proveedor, usuario, fecha, estado, total y clave idempotente |
| 12 | `detalles_compras` | compra, producto, ubicación, cantidad, costo unitario y subtotal |
| 13 | `ventas` | cliente, usuario, fecha, estado, total y clave idempotente |
| 14 | `detalles_ventas` | venta, producto, ubicación, cantidad, precio unitario y subtotal |
| 15 | `ajustes_inventario` | producto, ubicación, usuario, cantidades, diferencia, motivo, movimiento, clave y fecha |

Todos usan `id` como PK y marcas temporales Sequelize. `usuarios` renombra `createdAt` a `fechaCreacion`. Son únicos los pares (`bodegaId`, `codigo`) y (`productoId`, `ubicacionId`).

## 12. Relaciones y claves foráneas

Las migraciones contienen 24 claves foráneas:

| Tabla | Relaciones |
|---|---|
| productos | categoría y proveedor (2) |
| ubicaciones | bodega (1) |
| existencias | producto y ubicación (2) |
| movimientos_inventario | producto, tipo, origen, destino y usuario (5) |
| compras | proveedor y usuario (2) |
| detalles_compras | compra, producto y ubicación (3) |
| ventas | cliente y usuario (2) |
| detalles_ventas | venta, producto y ubicación (3) |
| ajustes_inventario | producto, ubicación, usuario y movimiento (4) |

Las relaciones son 1:N para catálogos y documentos; `existencias` materializa la relación producto–ubicación. Un ajuste se enlaza con un movimiento único.

## 13. Modelo entidad-relación

[docs/diagrama-er.drawio](docs/diagrama-er.drawio) contiene 15 nodos de entidad y 24 conectores. Permanece editable. La exportación PNG/PDF está pendiente.

## 14. Funcionalidades backend

- Salud pública, autenticación y 15 grupos de entidad.
- Validación de cuerpos, IDs, tipos, formatos y campos permitidos.
- Errores JSON centralizados.
- Servicios transaccionales para movimientos, documentos y ajustes.
- Bloqueo de filas, idempotencia y trazabilidad del usuario.

## 15. Autenticación JWT y contraseñas cifradas

`POST /api/auth/register` genera `passwordHash` con bcrypt y 12 rondas. `POST /api/auth/login` compara el hash y firma JWT HS256 con el ID en `sub`. `GET /api/auth/me` entrega información pública.

`JWT_SECRET` proviene del entorno y exige al menos 32 bytes. `JWT_EXPIRES_IN` usa `1h` por defecto. El middleware valida Bearer, firma, algoritmo, expiración y usuario activo. Nunca se expone `passwordHash`.

## 16. Funcionalidades frontend

- Login, registro y verificación con `/api/auth/me`.
- Token en `sessionStorage`; no guarda contraseñas.
- Axios con Bearer y manejo de 401.
- Rutas privadas y cierre de sesión.
- Dashboard y módulos para productos, categorías, proveedores, clientes, bodegas, ubicaciones, existencias, tipos, movimientos, compras, ventas y ajustes.
- Cuenta propia en `/mi-cuenta`.
- Detalles de compra y venta en modales de sus páginas.

## 17. Reglas de integridad

- `existencias.cantidad` es la fuente de verdad por ubicación.
- `productos.cantidad` es un total derivado y transaccional.
- No se permite inventario negativo.
- Entrada exige destino; salida, origen; traslado, ubicaciones diferentes.
- Ubicaciones y tipos deben estar activos.
- La cantidad inicial positiva genera una entrada atómica.
- Compra incrementa y venta disminuye inventario.
- Todo error revierte la transacción.

Véase [docs/arquitectura_integridad.md](docs/arquitectura_integridad.md).

## 18. Restricciones CRUD justificadas

Hay 15 controladores, pero no modificación arbitraria:

- Usuarios: cada cuenta administra solo su registro; el alta pertenece a autenticación.
- Existencias: POST, PUT y DELETE directos responden 403.
- Movimientos y ajustes: PUT y DELETE responden 409.
- Compras, ventas y detalles: UPDATE y DELETE solo en `BORRADOR`.
- Bodegas, ubicaciones, tipos y clientes usan desactivación lógica.

Protegen trazabilidad, aunque una rúbrica de CRUD literal puede calificarlas parcialmente.

## 19. Pruebas automatizadas

El comando real es `cd backend && npm test`. `backend/test/run-tests.js` exige una base terminada en `_test` y rechaza la principal. La suite contiene 30 pruebas sobre autenticación, productos, inventario, compras, ventas, ajustes, rollback e idempotencia.

El resultado documental disponible registra 30 aprobadas y 0 fallidas en [docs/evidencias/final/RESULTADOS_PRUEBAS.md](docs/evidencias/final/RESULTADOS_PRUEBAS.md).

## 20. Limitaciones y pendientes

- Sin roles, refresh tokens, rate limiting ni paginación general.
- `sessionStorage` sigue expuesto ante XSS.
- Sin prueba de carga ni anulación contable posterior.
- Faltan las capturas visuales finales y una exportación PNG/PDF del ER.
- Postman no contiene respuestas guardadas, pero la ejecución completa aislada de 93 solicitudes y 253/253 aserciones está documentada en `docs/evidencias/final/REPORTE_POSTMAN_RUNNER.md`.

## 21. Conclusiones técnicas

El sistema supera el CRUD inicial: integra 15 entidades, autenticación, reglas transaccionales e interfaces operativas. Su fortaleza es impedir cambios de cantidades e historial fuera de servicios autorizados. Para cerrar la entrega deben producirse evidencias visuales y aclararse la evaluación de las restricciones CRUD.

## 22. Repositorio

[Repositorio en GitHub](https://github.com/anaocampo1994fwdcostarica-code/Sistema-de-Gesti-n-de-Inventario-Empresarial)
