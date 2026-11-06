# Índice de evidencias finales

Fecha de preparación: 5 de noviembre de 2026.

Estados:

- **DISPONIBLE**: archivo real y verificable presente.
- **PENDIENTE**: requiere captura manual real.
- **NO APLICABLE**: el requisito no necesita ese tipo de evidencia.

## Evidencias visuales

| # | Evidencia | Requisito | Estado |
|---:|---|---|---|
| 1 | `01_login.png` | Autenticación | PENDIENTE |
| 2 | `02_dashboard.png` | Navegación y sesión | PENDIENTE |
| 3 | `03_productos.png` | Catálogo de productos | PENDIENTE |
| 4 | `04_categorias.png` | Categorías | PENDIENTE |
| 5 | `05_proveedores.png` | Proveedores | PENDIENTE |
| 6 | `06_clientes.png` | Clientes | PENDIENTE |
| 7 | `07_bodegas.png` | Bodegas | PENDIENTE |
| 8 | `08_ubicaciones.png` | Ubicaciones | PENDIENTE |
| 9 | `09_existencias.png` | Existencias | PENDIENTE |
| 10 | `10_movimientos.png` | Movimientos y trazabilidad | PENDIENTE |
| 11 | `11_compras.png` | Compras | PENDIENTE |
| 12 | `12_detalle_compra.png` | Detalles y confirmación de compra | PENDIENTE |
| 13 | `13_ventas.png` | Ventas | PENDIENTE |
| 14 | `14_detalle_venta.png` | Detalles y confirmación de venta | PENDIENTE |
| 15 | `15_ajustes.png` | Ajustes | PENDIENTE |
| 16 | `16_mi_cuenta.png` | Cuenta propia | PENDIENTE |
| 17 | `17_diagrama_er.png` | Modelo relacional | PENDIENTE |
| 18 | `18_pruebas_backend.png` | Suite automatizada | PENDIENTE |
| 19 | `19_coleccion_postman.png` | API REST | PENDIENTE |

No se creó ningún PNG vacío, ficticio o de relleno.

## Evidencias técnicas disponibles

| Evidencia | Requisitos cubiertos | Estado |
|---|---|---|
| `REPORTE_TECNICO.md` | 15 tablas, 15 controladores, 17 migraciones, 24 FK, JWT, Postman | DISPONIBLE |
| `RESULTADOS_PRUEBAS.md` | Ejecución real de 30 pruebas sobre base aislada | DISPONIBLE |
| `REPORTE_POSTMAN_RUNNER.md` | Ejecución aislada de 93 solicitudes: 253/253 aserciones aprobadas; base principal sin cambios | DISPONIBLE |
| `GUIA_CAPTURAS.md` | Procedimiento para obtener las 19 capturas reales | DISPONIBLE |
| `docs/diagrama-er.drawio` | Diagrama editable con 15 entidades y 24 relaciones | DISPONIBLE |
| `docs/postman/Inventario_Empresarial.postman_collection.json` | 93 solicitudes, 93 scripts, 6 casos 400, 4 casos 401 y 3 casos 404; JSON v2.1 válido | DISPONIBLE |
| `README.md` | Instalación, arquitectura, seguridad, API y pruebas | DISPONIBLE |
| Evidencia visual automatizada | No existe navegador automatizado instalado | NO APLICABLE |

## Cobertura por requisito académico

| Requisito | Evidencia disponible | Evidencia visual |
|---|---|---|
| Arquitectura React/Express/MySQL | README y reporte técnico | Dashboard pendiente |
| 15 tablas y relaciones | draw.io y reporte técnico | PNG del ER pendiente |
| 15 controladores | reporte técnico | No aplicable |
| 17 migraciones | reporte técnico | No aplicable |
| 24 claves foráneas | draw.io y reporte técnico | PNG del ER pendiente |
| JWT y rutas protegidas | código, README y pruebas | Login/dashboard pendientes |
| CRUD y catálogos | código, Postman | capturas 03–08 pendientes |
| Inventario y trazabilidad | servicios, pruebas y reporte | capturas 09–10 pendientes |
| Compras y ventas | pruebas y colección Postman | capturas 11–14 pendientes |
| Ajustes | pruebas y colección Postman | captura 15 pendiente |
| Suite automatizada | resultados de pruebas | captura 18 pendiente |
| API REST y errores 400/401/404 | colección Postman con aserciones explícitas | captura 19 del Runner pendiente |

## Estado general

La evidencia técnica está disponible y validada. Las **19 capturas PNG están
pendientes** porque no existe navegador automatizado ni exportador de
diagrams.net disponible en el entorno. Deben obtenerse manualmente siguiendo
`GUIA_CAPTURAS.md`.

