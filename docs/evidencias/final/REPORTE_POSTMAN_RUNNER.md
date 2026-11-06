# Reporte de ejecución Postman/Newman

## Resumen

| Elemento | Resultado |
|---|---|
| Fecha | 5 de noviembre de 2026 |
| Herramienta | Newman 6.2.3 ejecutado temporalmente con `npx` |
| Colección fuente | `docs/postman/Inventario_Empresarial.postman_collection.json` |
| Colección ejecutada | copia temporal reordenada, con 93 solicitudes |
| Entorno seguro | `NODE_ENV=test` |
| Base verificada desde Sequelize | `inventario_empresarial_test` |
| Puerto aislado | `127.0.0.1:3104` |
| PID aislado | 34684 |
| Servidor supervisor | no utilizado |
| Base principal escrita | no |

## Antecedente de seguridad

Una ejecución anterior en el puerto 3004 escribió por error en `inventario_empresarial`. Esa ejecución fue detenida y sus registros temporales principales siguen pendientes de limpieza con autorización independiente.

La ejecución descrita en este reporte no reutilizó 3004. Antes de abrir 3104, el lanzador:

1. estableció `NODE_ENV=test`;
2. exigió `TEST_DB_NAME=inventario_empresarial_test`;
3. rechazó coincidencia entre la base principal y la de prueba;
4. autenticó Sequelize;
5. ejecutó `SELECT DATABASE() AS activeDatabase` desde la misma conexión Sequelize;
6. comparó el resultado exacto con `inventario_empresarial_test`;
7. abrió el puerto únicamente después de validar esa coincidencia.

El listener de 3104 coincidió con el PID 34684 y fue detenido tras finalizar Newman.

## Resultado de Newman

| Métrica | Resultado |
|---|---:|
| Solicitudes ejecutadas | 93 |
| Solicitudes con error de transporte | 0 |
| Scripts ejecutados | 93 |
| Aserciones totales | 253 |
| Aserciones aprobadas | 253 |
| Aserciones fallidas | 0 |
| Duración | 9,5 segundos |

## Casos negativos

| Código | Casos ejecutados | Resultado |
|---:|---:|---|
| 400 | 6 | 6 aprobados |
| 401 | 4 | 4 aprobados |
| 404 | 3 | 3 aprobados |
| 409 | 12 | 12 respuestas de restricción esperadas |

## Aislamiento y conteos de control

Antes de Newman:

| Base | Tablas físicas | Filas |
|---|---:|---:|
| `inventario_empresarial` | 16 | 45 |
| `inventario_empresarial_test` | 15 | 33 |

Después de Newman:

- `inventario_empresarial`: sin diferencias de conteo por tabla.
- `inventario_empresarial_test`: recibió exclusivamente los datos temporales esperados.

Cambios en la base aislada:

| Tabla | Variación |
|---|---:|
| usuarios, categorias, proveedores, productos, bodegas, ubicaciones, existencias, tipos_movimiento, clientes, compras, detalles_compras, ventas, detalles_ventas, ajustes_inventario | +1 cada una |
| movimientos_inventario | +4 |

No se ejecutó limpieza automática contra la base principal.

## Corrección aplicada a datos de prueba

Los fallos raíz anteriores se debían a códigos de más de 30 caracteres. La copia temporal utilizó:

- Producto: `P-{{$timestamp}}`.
- Tipo de movimiento: `PME-{{$timestamp}}`.

Ambos permanecen por debajo del límite de 30 caracteres. Los cuerpos de actualización omitieron el código cuando no era necesario.

## Corrección final de ajustes

La respuesta real de creación de ajustes devuelve el recurso bajo `response.ajuste.id`. Se corrigió el script de la colección para guardar `ajusteId` desde esa ruta y validar el mismo campo. Las solicitudes posteriores de actualización y eliminación utilizaron el identificador correcto y comprobaron las respuestas `409` esperadas por inmutabilidad.

La ejecución final no tuvo fallos.

## Estado académico

La colección demuestra mediante ejecución real:

- autenticación y protección Bearer;
- validaciones 400;
- accesos sin token o token inválido con 401;
- recursos y rutas inexistentes con 404;
- restricciones 403 y 409;
- operaciones de catálogos, inventario, compras y ventas.

La ejecución final alcanzó 253/253 aserciones aprobadas y cumple el requisito de no escribir en la base principal.

## Captura real recomendada

Para la evidencia visual:

1. Abrir Postman Runner.
2. Usar solamente la copia configurada con `baseUrl=http://127.0.0.1:3104`.
3. Verificar en el log de inicio la línea `POSTMAN_TEST_READY` con la base de pruebas.
4. Ejecutar una iteración.
5. Capturar el resumen de solicitudes, aserciones y duración.
6. Ocultar correo, contraseña, JWT y encabezados Bearer.
7. Guardar como `docs/evidencias/final/19_coleccion_postman.png`.

No se creó ninguna captura ficticia.
