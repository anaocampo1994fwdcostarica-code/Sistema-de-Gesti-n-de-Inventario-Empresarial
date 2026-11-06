# Auditoría académica del Sistema de Gestión de Inventario Empresarial

**Fecha de revisión:** 5 de noviembre de 2026  
**Rama revisada:** `Ana`  
**Estados utilizados:** CUMPLE, CUMPLE PARCIALMENTE, NO CUMPLE y NO VERIFICABLE.

## A. Identificación del proyecto

| Elemento | Resultado |
|---|---|
| Proyecto | Sistema de Gestión de Inventario Empresarial |
| Repositorio | [GitHub](https://github.com/anaocampo1994fwdcostarica-code/Sistema-de-Gesti-n-de-Inventario-Empresarial) |
| Backend | Node.js, Express 5, Sequelize 6 y MySQL |
| Frontend | React 19, Vite 8, React Router 7 y Axios |
| Seguridad | bcrypt y JWT HS256 |
| Estructura verificada | 15 modelos, 15 controladores de entidad y 17 migraciones JavaScript |
| Modelo relacional | 15 tablas empresariales y 24 claves foráneas |

Evidencia: `backend/package.json`, `frontend/package.json`, `backend/models/index.js`, `backend/controllers/` y `backend/migrations/`.

## B. Objetivo y alcance

La auditoría determina el grado de cumplimiento de los entregables académicos del Día 1 y Día 2 frente al código y documentación actuales. Revisa estructura, datos, API, autenticación, frontend, pruebas y evidencias.

No se modificó backend, frontend, migraciones ni MySQL. La revisión de base de datos se limita a modelos, migraciones y asociaciones del repositorio; no se consultó el servidor MySQL principal.

## C. Metodología de verificación

1. Inspección de Git y rama.
2. Lectura de `PROYECTO.md`, `README.md` y documentación académica.
3. Conteo y revisión de modelos, migraciones, asociaciones, controladores y rutas.
4. Contraste de rutas Express con controladores y respuestas HTTP.
5. Revisión de JWT, bcrypt y serialización pública.
6. Inspección de rutas, páginas, contexto y servicios React.
7. Análisis estructural de Postman y scripts.
8. Conteo del XML editable de diagrams.net.
9. Revisión de resultados de prueba ya documentados.

## D. Matriz de requisitos del Día 1

| Requisito | Peso | Estado | Evidencia |
|---|---:|---|---|
| Tema, modelo y relaciones | 35 % | CUMPLE | `docs/justificacion.md`, `docs/diagrama-er.drawio` y migraciones iniciales |
| Enfoque empresarial | 15 % | CUMPLE | `docs/justificacion.md` desarrolla problemática, beneficios y alcance |
| Estructura backend/frontend | 20 % | CUMPLE | carpetas `backend/`, `frontend/` y `docs/` |
| Inicio del CRUD: crear y listar | 30 % | CUMPLE | `categoriaController.js` y evidencia histórica DOCX con Postman y códigos 201/200 |

### Estimación ponderada

| Componente | Puntaje estimado |
|---|---:|
| Modelado | 35/35 |
| Enfoque empresarial | 15/15 |
| Estructura | 20/20 |
| Inicio del CRUD | 30/30 |
| **Total documental estimado** | **100/100** |

La estimación no sustituye la calificación del profesor. Evidencia histórica: `docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx`, que contiene cinco recursos gráficos incrustados.

## E. Matriz de requisitos del Día 2

| Requisito | Estado | Evidencia y observación |
|---|---|---|
| Investigación JWT con fuentes | CUMPLE | `docs/investigacion_jwt_dia_2.md` incluye RFC 7519, RFC 8725, OWASP, MDN y documentación técnica |
| Diagrama ER actualizado con Usuario | CUMPLE | `docs/diagrama-er.drawio` contiene `usuarios` y 14 entidades adicionales |
| CRUD completo de todas las entidades | CUMPLE PARCIALMENTE | existen 15 controladores y cinco rutas nominales, pero algunas escrituras se restringen por seguridad e inmutabilidad |
| Registro, login, perfil y contraseñas cifradas | CUMPLE | `authController.js`, `authenticate.js` y `usuario.js` |
| Postman con 400, 401 y 404 | CUMPLE | 93 solicitudes, 93 scripts y ejecución aislada con 253/253 aserciones; 6 casos 400, 4 casos 401 y 3 casos 404 |
| React: login, registro, protección y logout | CUMPLE | `frontend/src/App.jsx`, `AuthContext.jsx`, `RutaProtegida.jsx` y `Navbar.jsx` |
| Página por entidad | CUMPLE PARCIALMENTE | 13 representaciones de entidad; detalles de compra/venta viven en modales, no en páginas independientes |
| README de instalación y configuración | CUMPLE | `README.md` actualizado y contrastado con ambos `package.json` |

## F. Matriz CRUD de las 15 entidades

Todas las rutas de esta matriz requieren JWT y usan la ruta base indicada.

| Entidad / ruta | CREATE | READ | UPDATE | DELETE | Restricción | Estado |
|---|---|---|---|---|---|---|
| Usuarios `/api/usuarios` | POST devuelve 403; alta en `/auth/register` | cuenta propia | cuenta propia | desactivación propia | prohíbe administrar terceros | CUMPLE PARCIALMENTE |
| Categorías `/api/categorias` | 201 | lista y detalle | 200 | eliminación física | 409 con productos | CUMPLE |
| Proveedores `/api/proveedores` | 201 | lista y detalle | 200 | eliminación física | 409 con productos | CUMPLE |
| Productos `/api/productos` | 201 | lista y detalle | datos descriptivos | eliminación física | cantidad solo vía inventario | CUMPLE PARCIALMENTE |
| Bodegas `/api/bodegas` | 201 | lista y detalle | 200 | desactivación | nombre único | CUMPLE |
| Ubicaciones `/api/ubicaciones` | 201 | lista y detalle | 200 | desactivación | 409 con existencias | CUMPLE |
| Existencias `/api/existencias` | 403 | lista y detalle | 403 | 403 | escritura solo por servicio | CUMPLE PARCIALMENTE |
| Tipos `/api/tipos-movimiento` | 201 | lista y detalle | 200 | desactivación | código/nombre únicos | CUMPLE |
| Movimientos `/api/movimientos-inventario` | 201 transaccional | lista y detalle | 409 | 409 | historial inmutable | CUMPLE PARCIALMENTE |
| Clientes `/api/clientes` | 201 | lista y detalle | 200 | desactivación | documento único | CUMPLE |
| Compras `/api/compras` | borrador | lista y detalle | solo borrador | solo borrador | confirmación adicional | CUMPLE |
| Detalles compra `/api/detalles-compras` | solo borrador | lista y detalle | solo borrador | solo borrador | confirmado es inmutable | CUMPLE |
| Ventas `/api/ventas` | borrador | lista y detalle | solo borrador | solo borrador | confirmación y stock | CUMPLE |
| Detalles venta `/api/detalles-ventas` | solo borrador | lista y detalle | solo borrador | solo borrador | confirmado es inmutable | CUMPLE |
| Ajustes `/api/ajustes-inventario` | 201 transaccional | lista y detalle | 409 | 409 | ajuste aplicado inmutable | CUMPLE PARCIALMENTE |

Evidencia: `backend/routes/`, `backend/controllers/`, `inventarioService.js`, `documentoService.js` y `ajusteService.js`.

## G. Auditoría de autenticación JWT

| Control | Estado | Evidencia |
|---|---|---|
| Registro público | CUMPLE | `POST /api/auth/register` |
| Hash de contraseña | CUMPLE | bcrypt, 12 rondas, `authController.js` |
| Login y JWT | CUMPLE | HS256, `sub` con ID, expiración configurable |
| Expiración de una hora | CUMPLE | `JWT_EXPIRES_IN` o valor por defecto `1h` |
| Secreto desde entorno | CUMPLE | `config/jwt.js` exige al menos 32 bytes |
| Middleware Bearer | CUMPLE | `middlewares/authenticate.js` |
| Perfil público | CUMPLE | `GET /api/auth/me` y serialización sin hash |
| React protegido | CUMPLE | `AuthContext.jsx` y `RutaProtegida.jsx` |
| Logout y 401 | CUMPLE | token en `sessionStorage` y eliminación de sesión |
| Roles/permisos | NO CUMPLE | fuera del alcance declarado; cualquier usuario autenticado accede a rutas empresariales |
| Refresh token | NO CUMPLE | no implementado por decisión académica |

Riesgos: XSS sobre `sessionStorage`, falta de rate limiting y necesidad de HTTPS/CSP en producción. Referencia: `docs/investigacion_jwt_dia_2.md`.

## H. Auditoría de Postman

La colección actual fue analizada desde `docs/postman/Inventario_Empresarial.postman_collection.json`.

| Métrica | Resultado | Estado |
|---|---:|---|
| Versión | Collection v2.1 | CUMPLE |
| Solicitudes totales | 93 | CUMPLE |
| Scripts de prueba | 93 | CUMPLE |
| Casos explícitos 400 | 6 | CUMPLE |
| Casos explícitos 401 | 4 | CUMPLE |
| Casos explícitos 404 | 3 | CUMPLE |
| Respuestas guardadas | 0 | NO REQUERIDO por la rúbrica; opcional como evidencia adicional |
| Evidencia de Runner actual | reporte de ejecución disponible | CUMPLE |
| Variables sensibles | vacías | CUMPLE |

Los scripts comprueban código exacto, JSON y campos relevantes; login almacena token y las altas guardan IDs. El reporte final documenta una ejecución aislada contra `inventario_empresarial_test`: 93 solicitudes, 253/253 aserciones aprobadas, cero fallos y cero errores de transporte. Esta auditoría documental no repitió esa ejecución.

## I. Auditoría del frontend

| Entidad o función | Representación React | Estado |
|---|---|---|
| Usuarios | `MiCuenta.jsx`, solo cuenta propia | CUMPLE PARCIALMENTE |
| Categorías | `Categorias.jsx` | CUMPLE |
| Proveedores | `Proveedores.jsx` | CUMPLE |
| Productos | `Productos.jsx` | CUMPLE |
| Bodegas | `Bodegas.jsx` | CUMPLE |
| Ubicaciones | `Ubicaciones.jsx` | CUMPLE |
| Existencias | `Existencias.jsx` | CUMPLE |
| Tipos de movimiento | `TiposMovimiento.jsx` | CUMPLE |
| Movimientos | `Movimientos.jsx` | CUMPLE |
| Clientes | `Clientes.jsx` | CUMPLE |
| Compras | `Compras.jsx` | CUMPLE |
| Detalles de compra | modal dentro de Compras | CUMPLE PARCIALMENTE |
| Ventas | `Ventas.jsx` | CUMPLE |
| Detalles de venta | modal dentro de Ventas | CUMPLE PARCIALMENTE |
| Ajustes | `Ajustes.jsx` | CUMPLE |

Las rutas públicas son `/login` y `/registro`. Las rutas privadas incluyen dashboard, 12 módulos empresariales y `/mi-cuenta`. Evidencia: `frontend/src/App.jsx`.

## J. Auditoría de MySQL

| Elemento | Estado | Evidencia |
|---|---|---|
| Modelos Sequelize | CUMPLE | 15 archivos en `backend/models/` |
| Migraciones | CUMPLE | 17 archivos `.js` en `backend/migrations/` |
| Asociaciones | CUMPLE | métodos `associate` y `models/index.js` |
| Claves foráneas | CUMPLE | 24 referencias en migraciones |
| Únicos y checks | CUMPLE | códigos, correos, pares compuestos, cantidades |
| Estado aplicado en MySQL principal | NO VERIFICABLE | no se conectó ni ejecutó `db:migrate:status` en esta fase |
| Consistencia de datos actuales | NO VERIFICABLE | no se consultaron registros de la base principal |

## K. Resultados de pruebas

| Verificación | Resultado | Fuente |
|---|---|---|
| Backend automatizado | 30 aprobadas, 0 fallidas | `docs/evidencias/final/RESULTADOS_PRUEBAS.md` |
| Aislamiento backend | base terminada en `_test` y guardas contra principal | `backend/test/run-tests.js` |
| Frontend lint | último resultado documentado exitoso | auditoría previa y `docs/evaluacion_academica_dia1_dia2.md` |
| Frontend build | último resultado documentado exitoso | auditoría previa y `docs/evaluacion_academica_dia1_dia2.md` |
| Postman | 93 solicitudes y 253/253 aserciones aprobadas | `docs/evidencias/final/REPORTE_POSTMAN_RUNNER.md` |

No se volvió a ejecutar `npm test`, lint ni build durante esta tarea documental.

## L. Evidencias disponibles y faltantes

### Disponibles

- Justificación empresarial.
- Investigación JWT con fuentes.
- ER editable con 15 entidades y 24 relaciones.
- Documento histórico del Día 1.
- Arquitectura e integridad.
- Colección Postman con casos negativos.
- Resultado documental de 30 pruebas.
- README y documento técnico actualizados.

### Faltantes

- Las 19 capturas descritas en `docs/evidencias/final/GUIA_CAPTURAS.md`.
- PNG o PDF legible del diagrama ER.
- Captura visual de Postman Runner; el resultado textual verificable sí está disponible.
- Respuestas guardadas en Postman, si el profesor las exige.
- Evidencia reciente de `npm test`, lint y build en la entrega final.

## M. Riesgos académicos

1. **Alto:** la frase “CRUD completo de todas las entidades” puede interpretarse literalmente; existencias, movimientos, ajustes y usuarios tienen operaciones restringidas.
2. **Medio:** no existe captura visual del Runner, aunque sí existe un reporte textual completo de la ejecución.
3. **Medio:** detalles de compras y ventas no tienen páginas React independientes.
4. **Medio:** no hay exportación PNG/PDF del ER.
5. **Medio:** el estado aplicado de las 17 migraciones no se verificó en MySQL durante esta auditoría.
6. **Bajo:** ausencia de roles, refresh tokens y rate limiting, documentada como limitación.

## N. Plan de correcciones priorizado

| Prioridad | Acción | Resultado esperado |
|---:|---|---|
| 1 | Obtener una captura real del resultado ya reproducible en Postman Runner | reforzar la evidencia visual de 400/401/404 |
| 2 | Consultar al profesor sobre CRUD restringido por integridad | criterio de evaluación explícito |
| 3 | Obtener las 19 capturas reales | cerrar evidencia visual |
| 4 | Exportar el ER a PNG/PDF | diagrama legible en la entrega |
| 5 | Ejecutar nuevamente test, lint y build | evidencia técnica reciente |
| 6 | Si se exige una página por tabla, crear rutas para detalles o justificar formalmente los modales | reducir ambigüedad |
| 7 | Guardar ejemplos Postman sin secretos, solo si la rúbrica lo exige | evidencia adicional |

## O. Lista final de verificación

- [x] Tema y justificación empresarial.
- [x] Proyecto separado en backend, frontend y documentación.
- [x] 15 modelos y controladores.
- [x] 17 migraciones JavaScript.
- [x] 24 claves foráneas documentadas.
- [x] JWT, bcrypt y rutas privadas.
- [x] Registro, login, perfil y logout.
- [x] Servicios transaccionales e idempotencia.
- [x] Colección con casos 400, 401 y 404.
- [x] README y PROYECTO actualizados.
- [ ] Confirmar aceptación académica del CRUD restringido.
- [x] Ejecutar Postman Runner en entorno aislado y documentar resultados.
- [ ] Obtener captura visual del Runner, si el profesor la exige.
- [ ] Capturar las 19 pantallas reales.
- [ ] Exportar el ER.
- [ ] Ejecutar validaciones finales antes del commit.
- [ ] Revisar que `.env`, tokens y respaldos permanezcan excluidos.

## Dictamen

**Día 1: CUMPLE**, con evidencia documental suficiente para los cuatro criterios y una estimación no vinculante de 100/100.

**Día 2: CUMPLE CON OBSERVACIONES.** La implementación técnica, la autenticación, la colección con casos negativos y las pruebas están respaldadas. Persisten riesgos formales por CRUD deliberadamente restringido, páginas no independientes para detalles y capturas visuales pendientes.
