# Resumen de cumplimiento académico

## Resultado general

| Entregable | Dictamen |
|---|---|
| Día 1 | CUMPLIDO |
| Día 2 | CUMPLIDO CON OBSERVACIONES |
| Cumplimiento orientativo | 95,5 % |

El porcentaje usa 22 requisitos: 1 punto para CUMPLIDO, 0,5 para CUMPLIDO CON OBSERVACIONES y 0 para PENDIENTE/NO VERIFICABLE. Se verificaron 20 requisitos completos y 2 con observaciones.

## Día 1

Los siete requisitos están respaldados: justificación, ER, estructura full stack, servidor, POST, GET y evidencia Postman. El DOCX histórico contiene cinco imágenes embebidas.

## Día 2

Están respaldados investigación JWT, ER actualizado, registro, login, perfil, bcrypt, JWT, Postman, errores 400/401/404, frontend de autenticación, rutas protegidas, logout y README.

### Observaciones

1. CRUD: usuarios, existencias, movimientos, ajustes y documentos confirmados restringen operaciones por seguridad, integridad e inmutabilidad.
2. Interfaz por entidad: detalles de compra/venta se gestionan en modales; Usuario se administra como cuenta propia.

Estas diferencias no son fallos accidentales, pero deben explicarse si la rúbrica se interpreta literalmente.

## Pruebas disponibles

- Postman/Newman: 93 solicitudes, 93 scripts, 253/253 aserciones, cero fallos.
- Casos negativos: 6 de HTTP 400, 4 de HTTP 401 y 3 de HTTP 404.
- Restricciones: 12 respuestas HTTP 409 esperadas.
- Backend: 30/30 pruebas aprobadas.
- Frontend: lint y build documentados como correctos.

## Pendientes

- Capturas visuales finales.
- Exportación PNG/PDF del ER.
- Confirmación del profesor sobre CRUD restringido y modales, si exige interpretación literal.
- Documento Word integrado de Día 1 y Día 2, solo si el profesor exige formato Word; actualmente solo existe el DOCX del Día 1.
