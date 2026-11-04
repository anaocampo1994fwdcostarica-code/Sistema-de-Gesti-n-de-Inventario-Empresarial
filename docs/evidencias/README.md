# Guía de evidencias del proyecto

Esta carpeta está destinada a las capturas que acompañarán la entrega académica. Las imágenes deben obtenerse del sistema en ejecución; este documento no sustituye las evidencias ni afirma resultados que no hayan sido capturados.

## Recomendaciones generales

- Iniciar el backend en `http://localhost:3004` y el frontend en `http://localhost:5173`.
- Usar datos ficticios claramente identificables y eliminarlos al finalizar.
- Evitar mostrar contraseñas, el archivo `backend/.env` o información personal real.
- Capturar la ventana completa cuando sea útil para mostrar la URL.
- Mantener una resolución legible y utilizar nombres descriptivos.
- Si una captura contiene registros de prueba, conservar los mismos nombres en la secuencia de creación, edición y eliminación.

## Capturas sugeridas

| Archivo sugerido | Evidencia | Contenido esperado |
|---|---|---|
| `01-dashboard.png` | Dashboard | Tarjetas con totales reales y accesos rápidos. |
| `02-categorias.png` | Categorías | Listado o estado vacío y botón para crear. |
| `03-proveedores.png` | Proveedores | Listado con nombre, teléfono y correo. |
| `04-productos.png` | Productos | Tabla con código, precio, cantidad, categoría y proveedor. |
| `05-crear-registro.png` | Creación | Formulario completo antes de guardar o mensaje de creación exitosa. |
| `06-editar-registro.png` | Edición | Formulario de edición y resultado actualizado. |
| `07-confirmar-eliminacion.png` | Eliminación | Diálogo de confirmación antes de eliminar. |
| `08-conflicto-integridad.png` | Integridad | Mensaje al intentar eliminar una categoría o proveedor relacionado. |
| `09-diagrama-er.png` | Modelo de datos | Exportación legible de `docs/diagrama-er.drawio`. |
| `10-api-health.png` | API | Respuesta JSON de `GET /api/health`. |
| `11-api-listado.png` | API CRUD | Respuesta JSON de uno de los listados. |
| `12-migraciones.png` | Base de datos | Salida de `npm run sequelize -- db:migrate:status`. |

## Secuencia recomendada para evidencias CRUD

1. Crear una categoría ficticia.
2. Crear un proveedor ficticio.
3. Crear un producto asociado a ambos.
4. Capturar los listados y el Dashboard actualizado.
5. Editar los tres registros y capturar el resultado.
6. Intentar eliminar la categoría o el proveedor mientras exista el producto para demostrar el conflicto.
7. Capturar el diálogo de confirmación.
8. Eliminar primero el producto y luego los registros relacionados.
9. Confirmar que los datos ficticios fueron retirados.

## Evidencias de API

Las solicitudes pueden mostrarse con Postman, Insomnia, Thunder Client o una terminal. No es necesario usar más de una herramienta.

Ejemplos de consultas de solo lectura:

```text
GET http://localhost:3004/api/health
GET http://localhost:3004/api/categorias
GET http://localhost:3004/api/proveedores
GET http://localhost:3004/api/productos
```

Al capturar operaciones de escritura, deben utilizarse únicamente registros ficticios creados para la demostración.

## Lista de control

- [ ] Dashboard
- [ ] Categorías
- [ ] Proveedores
- [ ] Productos
- [ ] Creación
- [ ] Edición
- [ ] Confirmación de eliminación
- [ ] Conflicto de integridad
- [ ] Diagrama ER
- [ ] API
- [ ] Estado de migraciones
- [ ] Limpieza de registros ficticios
