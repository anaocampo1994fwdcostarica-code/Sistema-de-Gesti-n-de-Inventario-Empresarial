# Índice definitivo de evidencias

Fecha de revisión: 5 de noviembre de 2026.

## Criterio de prioridad

La rúbrica proporcionada exige artefactos y funcionalidades, pero no enumera estos 19 PNG como archivos obligatorios individuales. Por tanto:

- **ESENCIAL PARA PRESENTACIÓN**: evidencia visual directa de un requisito central.
- **RECOMENDADA**: fortalece la demostración de la interfaz o una operación evaluable.
- **COMPLEMENTARIA**: demuestra alcance adicional, aunque el código y los reportes ya respaldan el requisito.

Los artefactos estrictamente necesarios ya existen en formato editable o documental: DOCX del Día 1, ER draw.io, colección Postman, código y reportes. Las capturas siguen siendo muy recomendables para una presentación clara.

## Capturas planificadas

| # | Archivo | Evidencia | Prioridad | Estado |
|---:|---|---|---|---|
| 1 | `01_login.png` | Login y acceso a registro | ESENCIAL PARA PRESENTACIÓN | PENDIENTE |
| 2 | `02_dashboard.png` | Sesión, ruta protegida y navegación | ESENCIAL PARA PRESENTACIÓN | PENDIENTE |
| 3 | `03_productos.png` | Catálogo y relaciones | RECOMENDADA | PENDIENTE |
| 4 | `04_categorias.png` | CRUD de categorías | RECOMENDADA | PENDIENTE |
| 5 | `05_proveedores.png` | CRUD de proveedores | RECOMENDADA | PENDIENTE |
| 6 | `06_clientes.png` | Gestión de clientes | COMPLEMENTARIA | PENDIENTE |
| 7 | `07_bodegas.png` | Gestión de bodegas | COMPLEMENTARIA | PENDIENTE |
| 8 | `08_ubicaciones.png` | Relación bodega/ubicación | COMPLEMENTARIA | PENDIENTE |
| 9 | `09_existencias.png` | Saldos por ubicación | RECOMENDADA | PENDIENTE |
| 10 | `10_movimientos.png` | Trazabilidad | RECOMENDADA | PENDIENTE |
| 11 | `11_compras.png` | Compras y estados | COMPLEMENTARIA | PENDIENTE |
| 12 | `12_detalle_compra.png` | Gestión de detalles mediante modal | RECOMENDADA | PENDIENTE |
| 13 | `13_ventas.png` | Ventas y estados | COMPLEMENTARIA | PENDIENTE |
| 14 | `14_detalle_venta.png` | Gestión de detalles mediante modal | RECOMENDADA | PENDIENTE |
| 15 | `15_ajustes.png` | Ajustes auditables | COMPLEMENTARIA | PENDIENTE |
| 16 | `16_mi_cuenta.png` | Perfil de la cuenta propia | RECOMENDADA | PENDIENTE |
| 17 | `17_diagrama_er.png` | ER actualizado legible | ESENCIAL PARA PRESENTACIÓN | PENDIENTE: exportación manual |
| 18 | `18_pruebas_backend.png` | Resumen 30/30 | RECOMENDADA | PENDIENTE |
| 19 | `19_coleccion_postman.png` | Runner: 93 solicitudes y 253/253 | ESENCIAL PARA PRESENTACIÓN | PENDIENTE |

No hay PNG reales dentro de esta carpeta. No se creó ninguna imagen vacía, simulada ni de relleno.

## Evidencias disponibles

| Evidencia | Contenido | Estado |
|---|---|---|
| `../../../entrega_final/Informe_Academico_Integrado_Dia_1_Dia_2.docx` | Informe académico principal de los Días 1 y 2, con 12 imágenes embebidas | DISPONIBLE; requiere completar el nombre del estudiante y revisar un correo visible |
| `../Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx` | Día 1 con cinco imágenes reales: ER inicial, estructura y POST/GET de categorías | DISPONIBLE |
| `REPORTE_TECNICO.md` | 15 tablas, 15 controladores, 17 migraciones y 24 FK | DISPONIBLE |
| `RESULTADOS_PRUEBAS.md` | Backend: 30/30 sobre base aislada | DISPONIBLE |
| `REPORTE_POSTMAN_RUNNER.md` | 93 solicitudes, 253/253 aserciones y base principal sin cambios | DISPONIBLE |
| `GUIA_CAPTURAS.md` | Procedimiento para producir capturas reales | DISPONIBLE |
| `../../diagrama-er.drawio` | ER editable: 15 entidades y 24 relaciones | DISPONIBLE |
| `../../postman/Inventario_Empresarial.postman_collection.json` | Collection v2.1: 93 solicitudes y 93 scripts | DISPONIBLE |
| `../../../README.md` | Instalación, arquitectura, seguridad y pruebas | DISPONIBLE |

## Evidencia histórica reutilizada

Las imágenes del DOCX del Día 1 son legibles y válidas para ese entregable. No deben reutilizarse como capturas del sistema actual porque muestran el modelo inicial de tres entidades y pruebas históricas de categorías.

## Archivo Word integrado

El Word definitivo de Día 1 y Día 2 está disponible en:

`entrega_final/Informe_Academico_Integrado_Dia_1_Dia_2.docx`

El archivo es un DOCX válido, conserva 12 imágenes embebidas y sus métricas coinciden con los reportes finales: Postman 93 solicitudes y 253/253 aserciones, backend 30/30, y frontend con lint y build correctos. También declara expresamente las restricciones de integridad de ciertas operaciones CRUD y el uso de modales.

Pendiente antes de la entrega: completar manualmente el campo de estudiante `[Completar]` y decidir si se sustituye o edita, con autorización, la captura de “Mi cuenta” que contiene un correo personal. El documento histórico del Día 1 se conserva como evidencia independiente.
