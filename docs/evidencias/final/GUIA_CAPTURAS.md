# Guía de capturas finales

## Reglas generales

1. Usar una ventana de navegador limpia y maximizada.
2. Verificar que cada pantalla haya terminado de cargar.
3. Mostrar título, navegación y contenido principal sin recortes.
4. Ocultar contraseñas, JWT, hashes, secretos, archivos `.env` y datos personales.
5. No usar herramientas de edición para inventar o alterar resultados.
6. Guardar PNG legible, preferiblemente a resolución de 1440 × 900 o superior.
7. Confirmar el nombre exacto antes de copiar el archivo a esta carpeta.
8. Si un modal tiene cambios sin guardar, cancelarlos de forma segura antes de continuar.

## Capturas requeridas

| Archivo | Acceso y contenido | Funcionalidad demostrada |
|---|---|---|
| `01_login.png` | Abrir `/login`; no escribir una contraseña visible | Inicio de sesión y acceso al registro |
| `02_dashboard.png` | Iniciar sesión y abrir `/` | Sesión JWT, navegación y resumen general |
| `03_productos.png` | Catálogos → Productos | Catálogo, tabla, creación y edición |
| `04_categorias.png` | Catálogos → Categorías | CRUD de categorías |
| `05_proveedores.png` | Catálogos → Proveedores | CRUD de proveedores |
| `06_clientes.png` | Catálogos → Clientes | CRUD de clientes |
| `07_bodegas.png` | Almacenamiento → Bodegas | Gestión de bodegas |
| `08_ubicaciones.png` | Almacenamiento → Ubicaciones | Relación entre bodega y ubicación |
| `09_existencias.png` | Inventario → Existencias | Saldos por producto y ubicación |
| `10_movimientos.png` | Inventario → Movimientos | Entradas, salidas, traslados y trazabilidad |
| `11_compras.png` | Operaciones → Compras | Listado, estados y totales |
| `12_detalle_compra.png` | Abrir una compra con detalles | Productos, ubicación, cantidades y confirmación |
| `13_ventas.png` | Operaciones → Ventas | Listado, estados y totales |
| `14_detalle_venta.png` | Abrir una venta con detalles | Productos, ubicación, cantidades y confirmación |
| `15_ajustes.png` | Inventario → Ajustes | Correcciones auditables e idempotencia |
| `16_mi_cuenta.png` | Navegación → Mi cuenta | Perfil propio; ocultar correo si es personal |
| `17_diagrama_er.png` | Abrir `docs/diagrama-er.drawio` en diagrams.net y exportar a PNG | 15 tablas, PK, FK y cardinalidades |
| `18_pruebas_backend.png` | En terminal: definir la base `_test` y ejecutar `npm test` | Resumen real: 30 aprobadas, 0 fallidas |
| `19_coleccion_postman.png` | Importar la colección y mostrar sus carpetas, variables sin valores sensibles y solicitudes | Colección v2.1 con 80 solicitudes |

## Captura de pruebas

En PowerShell:

```powershell
cd C:\Users\HP8D3\Downloads\inventario-empresarial\backend
$env:TEST_DB_NAME='inventario_empresarial_test'
npm test
Remove-Item Env:TEST_DB_NAME
```

Capturar únicamente cuando la terminal muestre el resumen final. No mostrar
variables de entorno ni abrir `.env`.

## Captura del diagrama

1. Abrir `docs/diagrama-er.drawio` en diagrams.net.
2. Seleccionar **Archivo → Exportar como → PNG**.
3. Elegir escala 2x o superior, fondo blanco y recorte al contenido.
4. Confirmar que se leen las 15 tablas.
5. Guardar como `17_diagrama_er.png`.

## Comprobación final de legibilidad

- Abrir cada PNG al 100 %.
- Verificar que textos y estados sean legibles.
- Confirmar que no haya notificaciones de error inesperadas.
- Confirmar que no aparezcan contraseñas, tokens, hashes ni secretos.
- Comprobar que el archivo corresponda realmente al nombre asignado.

