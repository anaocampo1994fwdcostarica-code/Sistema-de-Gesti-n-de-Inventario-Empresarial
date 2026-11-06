# Guía de instalación y ejecución

## Requisitos previos

- Node.js compatible con las dependencias declaradas.
- npm.
- MySQL disponible localmente.
- Git para clonar el repositorio.

## Obtener el proyecto

```bash
git clone https://github.com/anaocampo1994fwdcostarica-code/Sistema-de-Gesti-n-de-Inventario-Empresarial.git
cd Sistema-de-Gesti-n-de-Inventario-Empresarial
git switch Ana
```

## Backend

```bash
cd backend
npm install
```

Copiar `.env.example` como `.env` y completar localmente las variables de MySQL y JWT. No usar secretos incluidos en documentos o código. La base esperada para desarrollo es `inventario_empresarial`.

Crear la base vacía en MySQL y aplicar las migraciones desde `backend`:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:status
```

Iniciar la API:

```bash
npm start
```

Comprobar `http://localhost:3004/api/health`; debe responder JSON con estado `ok`.

## Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. El frontend usa `VITE_API_URL`; su valor de ejemplo apunta a `http://localhost:3004`.

## Pruebas backend aisladas

La suite recrea la base de pruebas. Nunca debe apuntarse a la base principal.

PowerShell, desde `backend`:

```powershell
$env:TEST_DB_NAME='inventario_empresarial_test'
npm test
Remove-Item Env:TEST_DB_NAME
```

El runner rechaza la base principal y exige un nombre terminado en `_test`.

## Verificación frontend

Desde `frontend`:

```bash
npm run lint
npm run build
```

## Postman

1. Importar `docs/postman/Inventario_Empresarial.postman_collection.json`.
2. Configurar `baseUrl` para un backend aislado.
3. Completar localmente `testEmail` y `testPassword`; la colección no contiene credenciales.
4. Ejecutar las solicitudes en orden y revisar los scripts.
5. No ejecutar contra datos reales para obtener evidencias.

## Limitaciones relevantes

- No hay roles ni refresh tokens.
- Los tokens se almacenan en `sessionStorage` por alcance académico.
- Existencias, movimientos y ajustes restringen escrituras para conservar integridad.
- Los detalles de compra y venta se administran mediante modales.
