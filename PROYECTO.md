# Estado del proyecto

## Sistema de Gestión de Inventario Empresarial

Documento de seguimiento técnico del proyecto académico.

## Estado actual

El sistema full stack se encuentra implementado y probado localmente. La base MySQL `inventario_empresarial` existe, las tres migraciones están aplicadas y el frontend consume la API real.

| Componente | Estado |
|---|---|
| Base de datos MySQL | Creada y conectada |
| Migraciones | Aplicadas |
| Modelos y relaciones | Implementados |
| API REST | Implementada |
| CRUD de categorías | Implementado y probado |
| CRUD de proveedores | Implementado y probado |
| CRUD de productos | Implementado y probado |
| Dashboard React | Implementado |
| Interfaz responsive | Implementada |
| CORS y Axios | Configurados |
| Documentación académica | Completada; capturas pendientes |

## Etapas completadas

### Etapa 1: organización

- Consolidación en una única raíz Git.
- Separación entre `backend/`, `frontend/` y `docs/`.
- Conservación del proyecto React/Vite existente.

### Etapa 2: modelo de datos

- Modelos `Categoria`, `Proveedor` y `Producto`.
- Relaciones uno a muchos.
- Validaciones de campos, correo, valores numéricos y unicidad.
- Tres migraciones consistentes con los modelos.

### Etapa 3: MySQL y migraciones

- Creación de la base `inventario_empresarial`.
- Aplicación de las migraciones de categorías, proveedores y productos.
- Verificación de claves primarias, claves foráneas y restricciones.

### Etapa 4: API REST

- Quince endpoints CRUD.
- Validación de IDs, cuerpos JSON y campos permitidos.
- Manejo de errores `400`, `404`, `409` y `500`.
- Inclusión de categoría y proveedor en las consultas de productos.
- Prueba completa de creación, consulta, actualización y eliminación con registros temporales.

### Etapa 5: interfaz React

- Dashboard con datos reales.
- Módulos de productos, categorías y proveedores.
- Formularios, mensajes, estados de carga y confirmaciones.
- Navegación con React Router DOM.
- Servicios centralizados con Axios.
- Diseño adaptable mediante CSS.

### Etapa 6: documentación

- README de instalación y uso.
- Justificación académica.
- Diagrama entidad-relación editable.
- Guía para recopilar evidencias.

## Puertos y direcciones

| Servicio | Puerto | Dirección |
|---|---:|---|
| Backend Express | 3004 | `http://localhost:3004` |
| Frontend Vite | 5173 | `http://localhost:5173` |
| MySQL | 3306 | `127.0.0.1:3306` |

La URL del backend se configura en `frontend/.env` mediante `VITE_API_URL`. Los orígenes permitidos se configuran en `backend/.env` mediante `CORS_ORIGINS`.

## Estructura actual

```text
inventario-empresarial/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .sequelizerc
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
├── docs/
│   ├── evidencias/
│   ├── diagrama-er.drawio
│   └── justificacion.md
├── .gitignore
├── PROYECTO.md
└── README.md
```

## Modelo de datos

- Una categoría puede tener muchos productos.
- Un proveedor puede tener muchos productos.
- Cada producto pertenece obligatoriamente a una categoría y a un proveedor.
- Las relaciones utilizan `ON UPDATE CASCADE` y `ON DELETE RESTRICT`.

## Pruebas realizadas

- Conexión MySQL mediante Sequelize.
- Verificación de estructura y restricciones en `information_schema`.
- Estado de migraciones mediante Sequelize CLI.
- Prueba de los quince endpoints CRUD.
- Verificación de códigos HTTP y respuestas JSON.
- Comprobación de conflictos referenciales.
- Prueba de CORS entre Vite y Express.
- Consulta de datos reales desde los cuatro módulos React.
- Compilación con `npm run build`.
- Revisión de código frontend con `npm run lint`.
- Auditoría de dependencias npm.

## Pendientes reales para la entrega

- Tomar y anexar las capturas indicadas en `docs/evidencias/README.md`.
- Revisar visualmente el diagrama en diagrams.net y exportarlo a PDF o PNG si la institución lo solicita.
- Revisar los archivos que se incluirán en Git.
- Crear el commit final únicamente después de la autorización correspondiente.

## Limitaciones

- No hay autenticación ni gestión de usuarios.
- No hay búsqueda, filtros o paginación.
- No hay pruebas automatizadas.
- El endpoint de salud verifica Express, pero no realiza una consulta activa a MySQL.
- El sistema está configurado para ejecución académica local.
