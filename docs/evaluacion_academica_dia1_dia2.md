# Evaluación académica final — Día 1 y Día 2

**Proyecto:** Sistema de Gestión de Inventario Empresarial  
**Fecha de actualización:** 5 de noviembre de 2026
**Rama evaluada:** `Ana`

Esta evaluación contrasta la rúbrica con código, documentos y evidencias existentes. Los resultados de prueba citados son antecedentes documentados; no fueron ejecutados nuevamente durante esta actualización.

## Resumen ejecutivo

- Día 1: listo para entregar.
- Día 2: listo con observaciones formales sobre CRUD restringido e interfaces embebidas.
- Estructura verificada: 15 modelos, 15 controladores de entidad y 17 migraciones.
- Postman: 93 solicitudes, 93 scripts y 253/253 aserciones aprobadas en `inventario_empresarial_test`.
- Backend: 30/30 pruebas aprobadas en base aislada.
- Frontend: lint y build documentados como exitosos.
- Evidencia visual final: las 19 capturas del índice siguen pendientes.

## Día 1

| Requisito | Estado | Evidencia |
|---|---|---|
| Justificación empresarial | CUMPLIDO | `docs/justificacion.md` y DOCX histórico |
| ER con atributos y relaciones | CUMPLIDO | DOCX histórico y `docs/diagrama-er.drawio` |
| Estructura backend/frontend | CUMPLIDO | `backend/`, `frontend/`, `docs/` |
| Servidor Node.js funcional | CUMPLIDO | `backend/server.js`, `/api/health` y pruebas documentadas |
| POST para crear registros | CUMPLIDO | Categorías y demás controladores; evidencia histórica 201 |
| GET para consultar registros | CUMPLIDO | Rutas de consulta; evidencia histórica 200 |
| Evidencia Postman | CUMPLIDO | `docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx`, con cinco imágenes embebidas |

**Dictamen Día 1:** CUMPLIDO y listo para entrega.

## Día 2

| # | Requisito | Estado | Evidencia u observación |
|---:|---|---|---|
| 1 | Investigación de tokens con fuentes | CUMPLIDO | `docs/investigacion_jwt_dia_2.md`; RFC 7519, RFC 8725, OWASP, MDN y documentación de bibliotecas |
| 2 | ER actualizado con usuarios | CUMPLIDO | draw.io editable con 15 entidades, incluida `usuarios` |
| 3 | CRUD completo para todas las entidades | CUMPLIDO CON OBSERVACIONES | 15 controladores y rutas nominales; usuarios, existencias, movimientos, ajustes y documentos confirmados restringen operaciones por seguridad e integridad |
| 4 | Registro de usuarios | CUMPLIDO | `POST /api/auth/register` |
| 5 | Inicio de sesión | CUMPLIDO | `POST /api/auth/login` |
| 6 | Perfil | CUMPLIDO | `GET /api/auth/me` y mantenimiento seguro de la cuenta propia |
| 7 | bcrypt | CUMPLIDO | Hash de contraseña; `passwordHash` no se serializa |
| 8 | JWT | CUMPLIDO | Expiración, Bearer y middleware de autenticación |
| 9 | Colección Postman | CUMPLIDO | Collection v2.1 con 93 solicitudes y 93 scripts |
| 10 | Casos 400, 401 y 404 | CUMPLIDO | 6 casos 400, 4 casos 401 y 3 casos 404; ejecución 253/253 |
| 11 | React con login y registro | CUMPLIDO | `Login.jsx`, `Registro.jsx`, `AuthContext.jsx` |
| 12 | Rutas protegidas | CUMPLIDO | `RutaProtegida.jsx` y rutas privadas en `App.jsx` |
| 13 | Cierre de sesión | CUMPLIDO | Limpieza del token y redirección al login |
| 14 | Interfaz por entidad | CUMPLIDO CON OBSERVACIONES | Los módulos están representados; detalles de compra/venta se gestionan en modales y Usuario mediante Mi cuenta, no en páginas administrativas independientes |
| 15 | README completo | CUMPLIDO | Instalación, entorno, migraciones, ejecución, API, seguridad y pruebas |

**Dictamen Día 2:** CUMPLIDO CON OBSERVACIONES. La interpretación literal de “CRUD completo” y “página por entidad” debe explicarse al profesor; no se recomienda debilitar las reglas de integridad para simular CRUD arbitrario.

## CRUD restringido

| Recurso | Restricción justificada |
|---|---|
| Usuarios | Solo la cuenta autenticada; alta pública por registro |
| Productos | La cantidad cambia únicamente mediante servicios transaccionales |
| Existencias | POST, PUT y DELETE directos responden 403 |
| Movimientos | PUT y DELETE responden 409; historial inmutable |
| Ajustes | PUT y DELETE responden 409; ajuste aplicado inmutable |
| Compras y ventas confirmadas | No se modifican ni eliminan después de afectar inventario |
| Detalles confirmados | Inmutables para conservar coherencia y trazabilidad |

## Pruebas respaldadas

| Prueba | Resultado documentado | Evidencia |
|---|---:|---|
| Postman/Newman | 253/253 aserciones, 0 fallos | `docs/evidencias/final/REPORTE_POSTMAN_RUNNER.md` |
| Backend | 30/30 pruebas, 0 fallos | `docs/evidencias/final/RESULTADOS_PRUEBAS.md` |
| Frontend lint | Exitoso | reportes técnicos y verificación previa |
| Frontend build | Exitoso, 131 módulos | reportes técnicos y verificación previa |

## Pendientes académicos

1. Obtener las 19 capturas reales enumeradas en `docs/evidencias/final/INDICE_EVIDENCIAS.md`.
2. Exportar el ER a PNG o PDF legible; el draw.io editable sí está disponible.
3. Solicitar aceptación del profesor para las restricciones de integridad si interpreta “CRUD completo” literalmente.
4. Confirmar si exige rutas independientes para detalles de compra y venta o acepta su administración mediante modales.
5. El documento Word existente cubre el Día 1; no existe un Word integrado definitivo de Día 1 y Día 2.

## Cálculo orientativo

Se evaluaron 22 requisitos: 7 del Día 1 y 15 del Día 2. Se asignó 1 punto a CUMPLIDO, 0,5 a CUMPLIDO CON OBSERVACIONES y 0 a PENDIENTE/NO VERIFICABLE. Resultado: 20 requisitos completos y 2 con observaciones, equivalentes a 21/22 o **95,5 % orientativo**. No sustituye la calificación del profesor.

## Respuestas finales

1. Día 1: sí, listo.
2. Día 2: sí, con observaciones declaradas.
3. Deben presentarse repositorio/rama `Ana`, README, PROYECTO, justificación, investigación JWT, ER, colección Postman, reportes de pruebas, DOCX del Día 1 y carpeta `entrega_final/`.
4. El Word existente no integra todo el Día 2; es evidencia histórica del Día 1.
5. Faltan capturas visuales y exportación gráfica del ER; además debe aclararse la interpretación de CRUD/páginas.
6. No se requieren más cambios de programación para demostrar la implementación actual; los pendientes son documentales/visuales o de criterio académico.
