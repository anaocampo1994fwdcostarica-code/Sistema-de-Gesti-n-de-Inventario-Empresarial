# Resultado de pruebas automatizadas

Fecha de ejecución: 5 de noviembre de 2026.

## Entorno

- Comando: `npm test`.
- Directorio: `backend`.
- Herramienta: Node.js Test Runner.
- Base utilizada: `inventario_empresarial_test`.
- Base principal `inventario_empresarial`: no utilizada por la suite.
- Puerto HTTP: efímero, asignado únicamente durante la prueba.

## Resumen real

| Métrica | Resultado |
|---|---:|
| Suites | 1 |
| Pruebas ejecutadas | 30 |
| Aprobadas | 30 |
| Fallidas | 0 |
| Canceladas | 0 |
| Omitidas | 0 |
| Pendientes | 0 |
| Duración total informada | 7098.0622 ms |

Estado: **APROBADA**.

## Cobertura observada

- autenticación válida e inválida;
- acceso protegido con y sin JWT;
- creación, consulta, actualización y validación de producto;
- entrada, salida y traslado;
- rechazo de cantidad negativa y stock insuficiente;
- compras, detalles, confirmación e idempotencia;
- ventas, detalles, confirmación, idempotencia y rollback;
- ajustes positivos, negativos e idempotentes;
- consistencia entre existencias y total de producto;
- inmutabilidad de movimientos;
- restricción de escritura directa de existencias.

## Garantía de aislamiento

Antes de iniciar, el lanzador confirmó literalmente:

```text
Base aislada verificada: inventario_empresarial_test
```

La suite exige que el nombre termine en `_test`, lo compara contra la base
principal y se detiene si no puede demostrar el aislamiento. Las 17 migraciones
se aplicaron solo a la base de pruebas recreada.

No se guardó el log completo porque puede variar en tiempos por caso; este
archivo conserva las métricas reales emitidas por la ejecución. La evidencia
visual `18_pruebas_backend.png` debe capturarse manualmente ejecutando de nuevo
la suite.

