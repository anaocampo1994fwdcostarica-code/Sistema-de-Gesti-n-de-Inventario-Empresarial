# Evaluación académica de los entregables Día 1 y Día 2

**Proyecto:** Sistema de Gestión de Inventario Empresarial  
**Fecha de auditoría:** 5 de noviembre de 2026  
**Rama inspeccionada:** `Ana`

> Esta evaluación es una estimación técnica basada en los archivos, la configuración y las pruebas disponibles. No sustituye la calificación del profesor.

## 1. Resumen ejecutivo

El proyecto supera ampliamente el alcance técnico inicial: contiene 15 modelos, 15 controladores de entidades, 17 migraciones, autenticación JWT, operaciones transaccionales y una suite de 30 pruebas aprobadas. El Día 1 está respaldado por un documento Word con cinco imágenes embebidas y evidencia específica de POST 201 y GET 200 en Postman.

El Día 2 presenta dos brechas frente a la redacción literal de la rúbrica:

1. La colección Postman contiene 80 solicitudes reales y cuerpos JSON, pero **no contiene scripts de prueba, respuestas guardadas ni casos explícitos 400, 401 y 404**.
2. Existen 15 controladores, pero **no hay CRUD funcional completo y arbitrario para las 15 entidades**. Existencias, movimientos y ajustes restringen operaciones por integridad; Usuarios limita el mantenimiento a la cuenta propia. Compras, ventas y sus detalles solo se editan mientras están en BORRADOR.

El frontend cumple autenticación, sesión y navegación protegida. Tiene vistas para 13 recursos de negocio; `detalles_compras` y `detalles_ventas` se administran dentro de los modales de compras y ventas, no mediante rutas/páginas independientes. Por ello, “una página por entidad” se considera cumplimiento parcial si el profesor interpreta el requisito literalmente.

## 2. Inventario de evidencias

| Evidencia | Ruta | Estado |
|---|---|---|
| Tema y justificación empresarial | `docs/justificacion.md` | Disponible |
| Entregable completo Día 1 | `docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx` | Disponible; 5 imágenes embebidas |
| Investigación JWT | `docs/investigacion_jwt_dia_2.md` | Disponible |
| Diagrama ER editable | `docs/diagrama-er.drawio` | Disponible; XML válido |
| Arquitectura e integridad | `docs/arquitectura_integridad.md` | Disponible |
| Colección Postman | `docs/postman/Inventario_Empresarial.postman_collection.json` | Disponible; Collection v2.1 |
| README | `README.md` | Disponible |
| Modelos | `backend/models/` | 15 modelos |
| Controladores de entidad | `backend/controllers/` | 15 controladores |
| Rutas | `backend/routes/` | 16 archivos, incluyendo autenticación |
| Servicios | `backend/services/` | Servicios transaccionales disponibles |
| Migraciones | `backend/migrations/` | 17 migraciones |
| Suite backend | `backend/test/` | 30 pruebas |
| Frontend | `frontend/src/` | React, autenticación y páginas protegidas |
| Evidencias finales | `docs/evidencias/final/` | Reportes disponibles; capturas pendientes |

## 3. Matriz de requisitos del Día 1

| Requisito | Estado | Evidencia concreta | Prueba realizada | Problema | Acción |
|---|---|---|---|---|---|
| Documento breve con tema y justificación | **CUMPLE** | `docs/justificacion.md` y sección 1 del DOCX | Lectura directa de ambos documentos | El documento histórico limita correctamente el alcance al Día 1 | Ninguna obligatoria |
| Diagrama ER con atributos y relaciones | **CUMPLE** | DOCX con figura del modelo inicial; `docs/diagrama-er.drawio` actualizado | DOCX: imagen embebida; draw.io: 15 entidades y 24 relaciones | El draw.io actual ya refleja la ampliación, no solo el modelo original | Conservar el DOCX como evidencia histórica |
| Repositorio backend/frontend | **CUMPLE** | `backend/`, `frontend/`, `docs/` | Inspección de estructura y compilación | Ninguno | Ninguna |
| Servidor con crear/listar una entidad probado | **CUMPLE** | DOCX: POST `/api/categorias` 201 y GET 200, con capturas Postman | Extracción del texto y conteo de 5 imágenes del DOCX | La colección actual no conserva esas respuestas, pero el DOCX sí | Conservar el DOCX sin sobrescribir |

## 4. Estimación ponderada del Día 1

| Criterio | Peso | Estimación | Fundamento |
|---|---:|---:|---|
| Modelado de datos | 35 % | 35/35 | Diagrama inicial documentado; modelo actual ampliado y consistente |
| Enfoque empresarial | 15 % | 15/15 | Problema, beneficios y justificación tecnológica claros |
| Estructura del proyecto | 20 % | 20/20 | Separación backend/frontend/docs demostrada |
| Inicio del CRUD | 30 % | 30/30 | Evidencia directa POST 201 y GET 200 en Postman dentro del DOCX |
| **Estimación total** | **100 %** | **100/100** | Sujeta a revisión del profesor |

## 5. Matriz de requisitos del Día 2

| # | Requisito | Estado | Evidencia | Brecha / acción |
|---:|---|---|---|---|
| 1 | Investigación profunda sobre tokens con fuentes | **CUMPLE** | `docs/investigacion_jwt_dia_2.md`: RFC 7519, RFC 8725, OWASP, MDN, jsonwebtoken y bcrypt | Ninguna obligatoria |
| 2 | ER actualizado incluyendo Usuario | **CUMPLE** | draw.io válido con 15 entidades, incluida `usuarios`, y 24 relaciones | Exportar PNG legible para la entrega |
| 3 | CRUD completos de todas las entidades | **CUMPLE PARCIALMENTE** | 15 controladores y rutas CRUD declaradas | Operaciones restringidas en usuarios, existencias, movimientos, ajustes y documentos confirmados |
| 4 | Registro, login y perfil; contraseñas cifradas | **CUMPLE** | `authController.js`, bcrypt, JWT y `/register`, `/login`, `/me` | Pruebas automatizadas aprobadas |
| 5 | Postman de cada endpoint con 400, 401 y 404 | **CUMPLE PARCIALMENTE** | 80 solicitudes con URL, método, cuerpo y Bearer | No hay scripts, ejemplos guardados ni casos explícitos 400/401/404 |
| 6 | React: login, registro, protección, logout y página por entidad | **CUMPLE PARCIALMENTE** | `App.jsx`, AuthContext, Axios y 16 archivos de página | Detalles de compra/venta son modales; no tienen ruta/página propia |
| 7 | README de instalación, .env y ejecución | **CUMPLE** | Secciones Instalación, Variables de entorno, MySQL, Ejecución y Pruebas | Ninguna obligatoria |

## 6. Matriz CRUD de las 15 entidades

Leyenda: **Sí** = operación implementada; **Cond.** = disponible con condición de negocio; **No** = deliberadamente bloqueada.

| Entidad | CREATE | READ | UPDATE | DELETE | Endpoint | Restricciones | Estado funcional |
|---|---|---|---|---|---|---|---|
| Usuarios | Cond. | Cond. | Cond. | Cond. | `/api/usuarios`; alta en `/api/auth/register` | Solo cuenta propia; POST del controlador devuelve 403; baja lógica | Parcial frente a CRUD literal; seguridad correcta |
| Categorías | Sí | Sí | Sí | Sí | `/api/categorias` | DELETE 409 si tiene productos | Implementado; POST/GET además evidenciados en Día 1 |
| Proveedores | Sí | Sí | Sí | Sí | `/api/proveedores` | DELETE 409 con productos | Implementado; no cubierto integralmente por suite actual |
| Productos | Sí | Sí | Sí | Sí | `/api/productos` | Cantidad solo mediante inventario; relaciones obligatorias | C/R/U y validaciones automatizadas; DELETE no probado en suite |
| Bodegas | Sí | Sí | Sí | Cond. | `/api/bodegas` | DELETE desactiva lógicamente | Implementado; no cubierto integralmente por suite |
| Ubicaciones | Sí | Sí | Sí | Cond. | `/api/ubicaciones` | No desactiva con existencias; unicidad por bodega/código | Implementado; no cubierto integralmente por suite |
| Existencias | No | Sí | No | No | `/api/existencias` | POST/PUT/DELETE devuelven 403 | Lectura funcional; escritura segura solo por servicios |
| Tipos de movimiento | Sí | Sí | Sí | Cond. | `/api/tipos-movimiento` | DELETE desactiva | Implementado; no cubierto integralmente por suite |
| Movimientos de inventario | Sí | Sí | No | No | `/api/movimientos-inventario` | PUT/DELETE devuelven 409 por inmutabilidad | Entrada/salida/traslado automatizados; no CRUD literal |
| Clientes | Sí | Sí | Sí | Cond. | `/api/clientes` | DELETE desactiva | Implementado; no cubierto integralmente por suite |
| Compras | Sí | Sí | Cond. | Cond. | `/api/compras` | Solo BORRADOR editable/eliminable; confirmación inmutable | Creación, confirmación e idempotencia automatizadas |
| Detalles de compras | Cond. | Sí | Cond. | Cond. | `/api/detalles-compras` | Escritura solo si compra está en BORRADOR | Creación automatizada; reglas coherentes |
| Ventas | Sí | Sí | Cond. | Cond. | `/api/ventas` | Solo BORRADOR editable/eliminable; valida stock | Creación, confirmación, rollback e idempotencia automatizadas |
| Detalles de ventas | Cond. | Sí | Cond. | Cond. | `/api/detalles-ventas` | Escritura solo si venta está en BORRADOR | Creación automatizada; reglas coherentes |
| Ajustes de inventario | Sí | Sí | No | No | `/api/ajustes-inventario` | PUT/DELETE devuelven 409 | Ajuste positivo/negativo e idempotencia automatizados |

### Conclusión sobre CRUD

**Los CRUD no cumplen literalmente “CRUD completo de todas las entidades”.** La arquitectura prioriza integridad y trazabilidad, lo cual es correcto empresarialmente, pero la rúbrica literal puede penalizar existencias, movimientos y ajustes. Tener 15 controladores no equivale a 15 CRUD funcionales completos.

## 7. Evaluación de autenticación y seguridad JWT

| Control | Resultado | Evidencia |
|---|---|---|
| Registro | Cumple | `POST /api/auth/register` |
| Login | Cumple | `POST /api/auth/login` |
| Perfil | Cumple | `GET /api/auth/me` |
| Hash de contraseña | Cumple | `bcrypt.hash(..., 12)` |
| Comparación segura | Cumple | `bcrypt.compare()` |
| Firma JWT | Cumple | `jsonwebtoken.sign()` |
| Verificación JWT | Cumple | `jsonwebtoken.verify()` |
| Expiración | Cumple | `JWT_EXPIRES_IN`, valor predeterminado 1h |
| Bearer | Cumple | Regex de `Authorization: Bearer` |
| Secreto externo | Cumple | `JWT_SECRET` validado; .env ignorado |
| Rutas privadas | Cumple | 15 grupos montados con `authenticate` |
| Password/hash en respuestas | Cumple según código y pruebas | Serialización pública y pruebas de ausencia de `passwordHash` |

## 8. Evaluación de Postman

- Formato: Collection v2.1 válida.
- Carpetas: 16.
- Solicitudes: 80.
- Variables: `baseUrl` y `token`.
- Autenticación Bearer: configurada por herencia.
- Cuerpos JSON: presentes.
- Confirmaciones de compra/venta: presentes.
- Operaciones restringidas: descritas.
- Scripts de prueba: **0**.
- Respuestas/ejemplos guardados: **0**.
- Casos explícitos 400: **0**.
- Casos explícitos 401: **0**.
- Casos explícitos 404: **0**.
- Evidencia de ejecución real de la colección actual: **no disponible**.

**Conclusión:** documenta correctamente la API, pero no satisface por sí sola el requisito explícito de probar 400, 401 y 404.

## 9. Evaluación del frontend React

| Aspecto | Estado | Evidencia |
|---|---|---|
| Login | Cumple | `pages/Login.jsx` |
| Registro | Cumple | `pages/Registro.jsx` |
| Rutas protegidas | Cumple | `RutaProtegida.jsx` y `App.jsx` |
| Logout | Cumple | Navbar + AuthContext |
| Persistencia de sesión | Cumple | `sessionStorage` y `GET /api/auth/me` |
| Bearer automático | Cumple | Interceptor Axios |
| Manejo de 401 | Cumple | Limpieza de token y redirección |
| Página por catálogo principal | Cumple | Productos, categorías, proveedores y demás módulos |
| Usuario | Parcial | `MiCuenta` cubre solo la cuenta propia |
| Detalles de compra | Parcial | Modal dentro de Compras, sin ruta independiente |
| Detalles de venta | Parcial | Modal dentro de Ventas, sin ruta independiente |
| Formularios y navegación | Cumple | Formularios reutilizables, modales y navegación superior |
| Responsive | Verificación estática | CSS responsive; falta evidencia visual manual |

## 10. Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `frontend npm run lint` | Exitosa |
| `frontend npm run build` | Exitosa; 131 módulos |
| `backend npm test` | 30 aprobadas, 0 fallidas |
| Base backend | `inventario_empresarial_test` |
| Base principal | No utilizada |

La suite verifica autenticación, producto, entrada, salida, traslado, stock insuficiente, compra, venta, rollback, idempotencia, ajustes, movimientos inmutables y bloqueo de escritura directa de existencias.

## 11. Evidencias faltantes

1. Casos Postman independientes para 400, 401 y 404.
2. Scripts `pm.test` o respuestas guardadas que demuestren los códigos esperados.
3. Evidencia real de ejecución de toda la colección actual.
4. Páginas/rutas independientes para detalles de compra y venta, si el profesor exige “una página por entidad” literalmente.
5. Aceptación explícita del profesor sobre recursos inmutables que no tienen UPDATE/DELETE funcional.
6. Las 19 capturas finales indicadas en `docs/evidencias/final/INDICE_EVIDENCIAS.md`.
7. PNG legible del diagrama ER actualizado.

## 12. Riesgos de evaluación académica

| Prioridad | Riesgo |
|---|---|
| **CRÍTICO** | Postman no demuestra 400, 401 ni 404, requisito explícito |
| **CRÍTICO** | La frase “CRUD completos de todas las entidades” no se cumple literalmente |
| **ALTO** | DetalleCompra y DetalleVenta no tienen páginas React independientes |
| **ALTO** | Falta evidencia ejecutada de la colección Postman actual |
| **MEDIO** | Varias operaciones CRUD de catálogos existen, pero no están cubiertas por la suite automatizada |
| **MEDIO** | Capturas visuales finales pendientes |
| **BAJO** | El frontend tiene cambios locales de diseño aún sin confirmar en Git |

## 13. Correcciones obligatorias antes del Word final

1. **Postman — CRÍTICO:** agregar carpetas o solicitudes negativas claramente nombradas para:
   - 400: cuerpo inválido o campo obligatorio faltante;
   - 401: ruta privada sin token o token inválido;
   - 404: ID inexistente.
2. Añadir scripts Postman que validen `pm.response.code` y guardar ejemplos/respuestas cuando sea posible.
3. Ejecutar la colección con una base de prueba y conservar evidencia del resumen.
4. Confirmar con el profesor si operaciones inmutables/restringidas se aceptan como justificación del CRUD. No habilitar edición arbitraria de inventario solo para aparentar cumplimiento.
5. Si “página por entidad” es literal, crear vistas/rutas de Usuario, Detalles de compra y Detalles de venta o documentar formalmente por qué se gestionan embebidas.
6. Generar las capturas reales pendientes y exportar el ER a PNG.

## 14. Mejoras opcionales

- Ampliar la suite para CRUD completo de categorías, proveedores, bodegas, ubicaciones, tipos y clientes.
- Agregar pruebas de concurrencia con varias conexiones.
- Reducir el tamaño del asset del logotipo del frontend.
- Incorporar accesibilidad visual automatizada.
- Crear un reporte Newman cuando se autorice instalar/utilizar esa herramienta.

## 15. Lista final antes de entregar

- [x] Tema y justificación Día 1.
- [x] Diagrama inicial y actualizado.
- [x] Repositorio backend/frontend.
- [x] POST y GET Día 1 demostrados en Postman.
- [x] Investigación JWT con fuentes.
- [x] Registro, login, perfil, bcrypt y JWT.
- [x] README de instalación y entorno.
- [x] Frontend lint.
- [x] Frontend build.
- [x] 30 pruebas backend en base aislada.
- [ ] Casos Postman 400, 401 y 404.
- [ ] Evidencia de ejecución de colección Postman actual.
- [ ] Resolver interpretación de CRUD completo para recursos inmutables.
- [ ] Resolver interpretación de página por entidad.
- [ ] Capturas finales y PNG del ER.
- [ ] Confirmar cambios visuales locales en Git cuando sean aprobados.

## 16. Dictamen final

### Día 1

**LISTO PARA ENTREGAR.** La evidencia Word contiene los cuatro entregables solicitados y respaldo visual de las pruebas básicas.

### Día 2

**NO ESTÁ LISTO PARA ENTREGAR BAJO UNA LECTURA LITERAL DE LA RÚBRICA.** La implementación técnica es sólida y las pruebas automatizadas pasan, pero faltan los casos Postman 400/401/404 y existe una diferencia entre “15 controladores” y “CRUD completo de todas las entidades”. También debe aclararse el requisito de una página React por entidad.

### Respuestas expresas

1. **¿Falta el informe JWT?** No. Existe y contiene fuentes técnicas verificables.
2. **¿Los CRUD cumplen literalmente?** No. Varias operaciones están deliberadamente restringidas.
3. **¿Postman incluye pruebas 400, 401 y 404?** No.
4. **¿React tiene una página por entidad?** No literalmente; dos entidades detalle se gestionan en modales y Usuario se limita a Mi Cuenta.
5. **¿Día 1 está listo?** Sí.
6. **¿Día 2 está listo?** No todavía bajo la rúbrica literal.
7. **¿Qué corregir antes del Word final?** Postman negativo y ejecutado, aclaración/ajuste de CRUD, páginas por entidad si son obligatorias, y evidencias visuales.

