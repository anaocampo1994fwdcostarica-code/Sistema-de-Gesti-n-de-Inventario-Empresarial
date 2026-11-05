# Arquitectura e integridad del sistema

## Propósito

Este documento describe cómo el Sistema de Gestión de Inventario Empresarial preserva consistencia, trazabilidad y concurrencia entre productos, existencias, movimientos, compras, ventas y ajustes.

## Capas

| Capa | Responsabilidad |
|---|---|
| React | Interfaz, validación básica, navegación protegida y presentación de errores |
| Axios | URL base, Bearer token, tratamiento centralizado de 401 |
| Express | Rutas REST, autenticación y middleware de errores |
| Controladores | Contratos HTTP, validaciones y serialización |
| Servicios | Reglas transaccionales e idempotencia |
| Sequelize | Modelos, asociaciones, transacciones y bloqueos |
| MySQL | Persistencia, claves foráneas, índices únicos y checks |

Los controladores no manipulan directamente las cantidades cuando una operación exige trazabilidad; delegan en los servicios de inventario, documentos y ajustes.

## Fuente de verdad de existencias

La fuente de verdad detallada es `existencias`, que almacena una fila por combinación de producto y ubicación. La restricción única `(productoId, ubicacionId)` impide duplicar saldos.

`productos.cantidad` se conserva por compatibilidad con el catálogo y el dashboard, pero es un total derivado:

```text
productos.cantidad = SUM(existencias.cantidad)
                      para todas las ubicaciones del producto
```

El total se recalcula y actualiza dentro de la misma transacción que modifica existencias. No debe editarse desde formularios, SQL manual ni endpoints genéricos.

## Servicio de inventario

`inventarioService.registrarMovimiento` es el único mecanismo autorizado para cambiar cantidades:

- ENTRADA: requiere ubicación destino y suma unidades.
- SALIDA: requiere ubicación origen, verifica saldo y resta unidades.
- TRASLADO: requiere ubicaciones distintas y actualiza ambas de forma atómica.

También valida producto, tipo activo, ubicaciones activas y cantidad entera positiva. Solo crea el movimiento después de actualizar correctamente las existencias.

## Transacciones Sequelize

Las operaciones críticas usan transacciones `READ COMMITTED`:

1. iniciar transacción;
2. leer y bloquear filas;
3. validar reglas;
4. modificar existencias;
5. actualizar total derivado;
6. crear movimiento y documento asociado;
7. confirmar la transacción.

Cualquier excepción provoca rollback completo. La creación de un producto con inventario inicial también crea primero el producto con cantidad cero y registra la entrada en la misma transacción.

## Bloqueos y concurrencia

Las consultas críticas usan bloqueos `UPDATE` sobre:

- producto;
- tipo de movimiento;
- ubicaciones;
- existencias;
- encabezados y detalles documentales.

Las ubicaciones y detalles se procesan en orden estable para reducir interbloqueos. Un traslado bloquea origen y destino dentro de la misma transacción. Esto evita pérdidas de actualización y ventas simultáneas que excedan el saldo.

La columna `existencias.version` habilita control optimista adicional en Sequelize, aunque el servicio utiliza principalmente bloqueo pesimista para operaciones de inventario.

## Compras

Una compra permanece editable en estado `BORRADOR`. Sus detalles contienen producto, ubicación receptora, cantidad, costo unitario y subtotal.

Al confirmar:

- se bloquea la compra;
- se exige al menos un detalle;
- se recalcula el total en backend;
- cada detalle genera una entrada con el tipo técnico `COMPRA`;
- se actualizan existencias y total de producto;
- se registra el usuario;
- la compra cambia a `CONFIRMADA`.

Una compra confirmada y sus detalles son inmutables.

## Ventas

La venta sigue el mismo ciclo de borrador, pero cada detalle genera una salida con tipo técnico `VENTA`. Si cualquier ubicación no tiene saldo suficiente, se revierte el documento completo: no cambia el estado, no se registran movimientos y no se modifican existencias.

## Ajustes

Un ajuste recibe producto, ubicación, cantidad nueva, motivo y clave de idempotencia. El servicio:

1. bloquea producto y ubicación;
2. obtiene la cantidad anterior;
3. calcula la diferencia;
4. utiliza `AJUSTE_ENTRADA` o `AJUSTE_SALIDA`;
5. aplica el movimiento;
6. verifica la cantidad resultante;
7. registra el ajuste enlazado al movimiento.

El ajuste es historial contable y no admite edición ni eliminación.

## Idempotencia

`compras.claveIdempotencia`, `ventas.claveIdempotencia` y `ajustes_inventario.claveIdempotencia` tienen restricción única.

- La primera solicitud aplica la operación.
- Un reintento con la misma clave devuelve el resultado existente.
- Un documento confirmado con otra clave produce 409.
- El frontend genera una clave distinta para cada intención de confirmación o ajuste.

Este mecanismo protege frente a doble clic, reintentos de red y respuestas perdidas.

## Historial y trazabilidad

`movimientos_inventario` registra:

- producto;
- tipo y efecto;
- origen y/o destino;
- cantidad;
- motivo;
- referencia;
- usuario responsable;
- fecha.

Los movimientos aplicados devuelven 409 ante PUT o DELETE. Los usuarios solo pueden administrar su propia cuenta, pero cada movimiento conserva su FK al usuario responsable.

## Integridad referencial

MySQL contiene 24 claves foráneas. Las eliminaciones con dependencias se rechazan o se reemplazan por desactivación lógica. Las restricciones únicas principales son:

- usuarios.correo;
- categorias.nombre;
- productos.codigo;
- bodegas.nombre;
- clientes.documento;
- tipos_movimiento.codigo y nombre;
- ubicaciones(bodegaId, codigo);
- existencias(productoId, ubicacionId);
- claves de idempotencia;
- ajustes_inventario.movimientoInventarioId.

## Operaciones deliberadamente restringidas

| Recurso | Restricción | Justificación |
|---|---|---|
| Existencias | POST/PUT/DELETE → 403 | Evitar cantidades sin movimiento |
| Movimientos | PUT/DELETE → 409 | Conservar trazabilidad |
| Ajustes | PUT/DELETE → 409 | Conservar auditoría |
| Compras/ventas confirmadas | PUT/DELETE → 409 | No reescribir operaciones aplicadas |
| Detalles confirmados | escritura → 409 | Mantener coherencia con movimientos |
| Usuarios | solo cuenta propia | No existen roles administrativos |

Estas rutas existen para expresar claramente el contrato, pero no deben describirse como CRUD funcional completo.

## Errores y recuperación

Los errores de validación se traducen a JSON con estados 400, 401, 403, 404 o 409. Los errores dentro de una transacción revierten todas las escrituras. Para recuperación operativa deben realizarse respaldos de MySQL antes de migraciones o pruebas que modifiquen datos.

## Seguridad pendiente para producción

- HTTPS obligatorio.
- Política CSP para reducir XSS.
- Rate limiting en login.
- Gestión de roles y permisos.
- Rotación segura de secretos.
- Cookies httpOnly como alternativa a sessionStorage si se implementa defensa CSRF.
- Suite automatizada permanente y monitoreo.

