# Investigación sobre JSON Web Token (JWT) — Día 2

## Introducción

El Sistema de Gestión de Inventario Empresarial necesita incorporar autenticación antes de restringir el acceso a las operaciones sobre categorías, proveedores y productos. Este documento estudia JSON Web Token (JWT), sus propiedades y sus riesgos, y define una decisión técnica proporcional al alcance académico del proyecto. La propuesta busca identificar al usuario, proteger la API y conservar una arquitectura comprensible, sin añadir roles, permisos ni mecanismos de renovación que la rúbrica no exige.

Un JWT no sustituye el almacenamiento seguro de contraseñas ni el uso de HTTPS. La contraseña permite comprobar la identidad durante el inicio de sesión; `bcrypt` permite almacenar un hash adaptable en lugar de la contraseña; el JWT representa temporalmente la autenticación ya comprobada; y HTTPS protege las credenciales y los tokens durante el transporte.

## Fundamentos de JWT

La especificación [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) define JWT como un formato compacto y seguro para URL que representa un conjunto de declaraciones o *claims* en JSON. Un JWT firmado suele adoptar la forma:

```text
header.payload.signature
```

Cada sección se codifica con Base64url y se separa mediante un punto:

1. **Header (encabezado):** identifica el tipo de token y el algoritmo criptográfico, por ejemplo, `{ "typ": "JWT", "alg": "HS256" }`.
2. **Payload (carga útil):** contiene las declaraciones. Para este sistema bastan un identificador estable del usuario en `sub` y, si es necesario para la interfaz, datos mínimos no sensibles. La biblioteca puede añadir `iat` (momento de emisión) y `exp` (vencimiento).
3. **Signature (firma):** protege la integridad del encabezado y la carga útil. En HS256 se calcula un código de autenticación HMAC-SHA-256 sobre las dos primeras secciones usando un secreto compartido.

Base64url es una codificación, no cifrado. Cualquiera que obtenga un JWT firmado puede decodificar el encabezado y el payload. La firma permite detectar modificaciones y autenticar al emisor que conoce la clave, pero no da confidencialidad. OWASP recomienda mantener la información sensible en el servidor, y [RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725.html) exige verificar explícitamente los algoritmos aceptados y no confiar ciegamente en los claims recibidos.

### Firma y verificación

Para emitir el token, el servidor autentica primero las credenciales, construye un payload mínimo y lo firma con una clave secreta. Para verificarlo, vuelve a calcular la firma con la clave configurada, comprueba que coincide y valida restricciones como algoritmo y vencimiento. Decodificar un token no equivale a verificarlo; las decisiones de acceso solo deben hacerse después de una verificación exitosa.

En una aplicación monolítica pequeña, donde la misma API emite y consume el token, HS256 es suficiente si se usa un secreto aleatorio de alta entropía. El secreto no debe ser una frase predecible, no debe estar en Git, no debe enviarse al frontend y no debe escribirse en registros. Debe llegar al proceso mediante `JWT_SECRET` y la aplicación debe fallar al iniciar si la variable está ausente. OWASP recomienda para HS256 una clave aleatoria de al menos 256 bits.

## Generación y validación en Node.js

La biblioteca [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#readme) ofrece `jwt.sign()` para firmar y `jwt.verify()` para validar. La futura implementación puede seguir conceptualmente este patrón:

```js
const token = jwt.sign(
  { sub: String(usuario.id) },
  process.env.JWT_SECRET,
  { algorithm: 'HS256', expiresIn: '1h' },
)

const payload = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'],
})
```

El ejemplo es orientativo y no constituye implementación en el repositorio. `jwt.verify()` debe utilizarse, no `jwt.decode()`, para autorizar solicitudes. También se debe fijar una lista de algoritmos aceptados para evitar confusión de algoritmos. El payload verificado sigue siendo entrada no confiable: se debe validar el tipo y formato de `sub` y consultar el usuario en MySQL antes de adjuntarlo a `req.user`.

El registro debe validar nombre, correo y contraseña; normalizar el correo; comprobar su unicidad; y producir el hash mediante la API asíncrona `bcrypt.hash()`. El inicio de sesión debe localizar al usuario y comparar la contraseña mediante `bcrypt.compare()`. La [documentación de bcrypt](https://www.npmjs.com/package/bcrypt) recomienda las funciones asíncronas en servidores para no bloquear el bucle de eventos. Nunca se devuelve ni se incorpora al JWT el hash de la contraseña.

### Middleware de autenticación

El middleware debe leer exactamente el encabezado:

```http
Authorization: Bearer <token>
```

Si el encabezado falta, el esquema no es `Bearer`, el token es inválido o está vencido, debe devolver una respuesta `401` uniforme. Si es válido, debe cargar el usuario, excluir `passwordHash`, asignarlo a `req.user` y continuar. El middleware se montará antes de las rutas CRUD de categorías, proveedores y productos; `/api/auth/register` y `/api/auth/login` serán públicas, y `/api/auth/me` estará protegida. La instancia Axios añadirá `Authorization` en un interceptor de solicitud, y un interceptor de respuesta centralizará los `401`, eliminará la sesión local y dirigirá al login.

## Expiración y renovación

El claim `exp` indica el instante a partir del cual el token no debe aceptarse. Según RFC 7519, se expresa como `NumericDate`, es decir, segundos desde el Unix epoch. `jsonwebtoken` permite declararlo con `expiresIn: '1h'`; la biblioteca valida `exp` al ejecutar `verify()` salvo que se desactive expresamente, opción que no debe usarse aquí.

Después de una hora el usuario deberá iniciar sesión nuevamente. El cliente puede anticipar el vencimiento para mejorar la experiencia, pero la API es la autoridad: un control de rutas React no constituye seguridad porque el usuario controla el navegador.

Un *refresh token* de duración mayor permite pedir nuevos access tokens sin volver a introducir credenciales. Su diseño seguro requiere otra credencial, rotación, revocación, almacenamiento persistente y detección de reutilización; aumenta el alcance y la superficie de ataque. No se recomienda en esta etapa porque la rúbrica pide expiración, no renovación silenciosa, y una sesión máxima de una hora es aceptable para el proyecto académico. Si posteriormente se exige, debe diseñarse como una fase separada y no simplemente emitir un JWT de larga duración.

## Almacenamiento del token en React

Las alternativas principales tienen compromisos diferentes:

| Mecanismo | Persistencia | Ventaja | Riesgo principal |
|---|---|---|---|
| `localStorage` | Sobrevive recargas y cierre del navegador | Integración simple con `Authorization: Bearer` | Cualquier JavaScript ejecutado por XSS puede leer y exfiltrar el token; persiste hasta retirarlo. |
| `sessionStorage` | Sobrevive recargas de la pestaña; termina al cerrar la pestaña | Simple, menor permanencia y compatible con Bearer | Sigue siendo legible por JavaScript y vulnerable a XSS. No comparte sesión entre pestañas. |
| Cookie `HttpOnly` | Según `Max-Age`/`Expires` | JavaScript no puede leer el token; reduce su robo directo mediante XSS | El navegador la envía automáticamente, por lo que exige diseño contra CSRF, `SameSite`, `Secure`, CORS con credenciales y cambios backend/frontend. |

OWASP desaconseja almacenar identificadores de sesión o tokens en Web Storage porque un XSS puede acceder a ellos. Las cookies `HttpOnly`, `Secure` y con `SameSite` apropiado son preferibles para un sistema expuesto a producción; `SameSite` es defensa en profundidad y no reemplaza por sí sola todas las defensas CSRF. Véanse la [guía de gestión de sesiones de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), la [guía HTML5 de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) y la referencia de [`Set-Cookie` de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie).

### Decisión para este proyecto

Para cumplir literalmente el requisito académico de `Authorization: Bearer token` con baja complejidad, se recomienda guardar el access token de una hora en **`sessionStorage`**, no en `localStorage`. La sesión resistirá recargas dentro de la misma pestaña y desaparecerá al cerrarla. Esta decisión no convierte Web Storage en seguro: se acepta conscientemente el riesgo de XSS en un entorno académico/local y se documenta que no es la opción aconsejable para producción.

El estado de autenticación debe mantenerse además en un contexto React, pero el contexto por sí solo se pierde al recargar. El cierre de sesión elimina el token de `sessionStorage` y limpia el usuario en memoria. No se deben guardar contraseña, hash, `JWT_SECRET` ni información sensible en ningún almacenamiento del navegador.

Si el sistema se publica, la recomendación cambia a una cookie `HttpOnly; Secure; SameSite` con defensas CSRF y configuración de CORS adecuada, o a un patrón BFF. En ese escenario se debe revisar si la exigencia académica de Bearer se mantiene o si el backend administra la cookie.

## Riesgos de seguridad

### XSS

Un atacante que logra ejecutar JavaScript en el origen puede leer `localStorage` o `sessionStorage`, robar el token y actuar como el usuario hasta su expiración. La mitigación incluye evitar renderizado de HTML no confiable, validar entradas, mantener dependencias actualizadas, aplicar Content Security Policy cuando el despliegue lo permita, reducir la vida del token y no guardar datos sensibles en él. Una cookie `HttpOnly` evita la lectura directa, aunque un XSS todavía podría ejecutar acciones desde el navegador comprometido.

### CSRF

CSRF aprovecha credenciales que el navegador adjunta automáticamente, especialmente cookies. Un token tomado de Web Storage y agregado expresamente al encabezado `Authorization` no suele enviarse en una solicitud CSRF tradicional; sin embargo, esto no resuelve XSS. Si se migra a cookies, se deben aplicar `SameSite`, comprobaciones de origen y un token CSRF u otra defensa apropiada para las operaciones que cambian estado.

### Contenido del payload

Nunca deben incluirse contraseñas, hashes de contraseña, `JWT_SECRET`, credenciales de base de datos, números de tarjeta, documentos sensibles ni información privada que el cliente no necesite. Tampoco conviene colocar permisos futuros como verdad irrevocable durante tokens largos. Para este proyecto, `sub` con el ID del usuario es suficiente; el perfil vigente se obtiene con `/api/auth/me`.

### Transporte y secretos

HTTPS es indispensable fuera de `localhost`: sin TLS, credenciales y tokens Bearer pueden ser interceptados y reutilizados. La firma JWT no cifra el token ni protege el canal. `JWT_SECRET` debe generarse criptográficamente, permanecer solo en variables de entorno o un gestor de secretos, tener un valor distinto por ambiente y rotarse si se expone. `.env.example` solo debe documentar el nombre de la variable, nunca un secreto funcional.

## Decisión técnica para nuestro sistema

Se propone:

- Crear `Usuario` con nombre, correo único normalizado y `passwordHash`; excluir siempre el hash de las respuestas.
- Usar la API asíncrona de `bcrypt`, con un costo definido en configuración y validación razonable de longitud (recordando el límite efectivo de 72 bytes de bcrypt).
- Implementar `POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/me`.
- Emitir un JWT HS256 con `sub`, `iat` y `exp`, vida de una hora, firmado con `JWT_SECRET` de al menos 256 bits suministrado por el entorno.
- Verificar firma, expiración, algoritmo y `sub` en un middleware; cargar el usuario actual y devolver `401` consistente ante ausencia, invalidez o vencimiento.
- Proteger las quince rutas CRUD en el router de Express. No añadir roles ni permisos.
- Enviar el access token mediante `Authorization: Bearer <token>` desde un interceptor Axios.
- Usar `sessionStorage` para este alcance académico, documentando el riesgo XSS; limpiar la sesión ante logout o `401`.
- Implementar `AuthContext`, páginas de login y registro y un componente de ruta protegida. La protección React mejora navegación, pero la seguridad efectiva reside en Express.
- No implementar refresh tokens en esta etapa. Tras una hora se solicita un nuevo login.
- Exigir HTTPS para cualquier despliegue que no sea desarrollo local.

## Conclusiones

JWT permite desacoplar la verificación de cada solicitud de una sesión almacenada en memoria del servidor, pero no elimina la necesidad de controles de seguridad. La firma garantiza integridad y autenticidad, no secreto; el vencimiento limita el tiempo de abuso, no revoca por sí solo un token; y una ruta React protegida no reemplaza al middleware de la API.

Para este proyecto, un access token HS256 de una hora, payload mínimo, secreto externo, bcrypt, middleware centralizado y Bearer token representa una solución proporcionada. `sessionStorage` simplifica el cumplimiento académico y reduce la persistencia frente a `localStorage`, aunque conserva el riesgo XSS. La ausencia deliberada de refresh tokens, roles y permisos mantiene el alcance alineado con la rúbrica y debe revisarse si el sistema evoluciona hacia producción.

## Fuentes consultadas

- IETF. [RFC 7519: JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519.html), mayo de 2015.
- IETF. [RFC 8725 / BCP 225: JSON Web Token Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725.html), febrero de 2020.
- Auth0. [`node-jsonwebtoken`: documentación de uso](https://github.com/auth0/node-jsonwebtoken#readme).
- OWASP. [JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html).
- OWASP. [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- OWASP. [HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).
- MDN Web Docs. [Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization).
- MDN Web Docs. [Set-Cookie header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie).
- kelektiv. [`bcrypt` para Node.js](https://www.npmjs.com/package/bcrypt).

Consulta realizada el 5 de noviembre de 2026. Las fuentes se revisaron en línea y los enlaces anteriores corresponden a los documentos consultados.
