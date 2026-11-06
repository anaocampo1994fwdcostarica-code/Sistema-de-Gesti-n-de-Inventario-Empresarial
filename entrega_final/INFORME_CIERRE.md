# Informe de cierre

## Componentes verificados

- 15 modelos Sequelize.
- 15 controladores de entidad.
- 17 migraciones.
- 15 entidades en el ER editable.
- Backend Express protegido con JWT.
- Contraseñas con bcrypt.
- Frontend React con login, registro, rutas privadas y logout.
- Operaciones transaccionales de inventario.
- Colección Postman v2.1 con 93 solicitudes y 93 scripts.
- Suite backend con 30 pruebas documentadas.

## Riesgos y limitaciones declaradas

1. La rúbrica puede interpretar “CRUD completo” como escritura arbitraria; el sistema prioriza integridad y trazabilidad.
2. Detalles de compra/venta no tienen rutas React independientes.
3. Faltan capturas visuales finales y exportación gráfica del ER.
4. El Word integrado está disponible, pero conserva el campo de estudiante como `[Completar]` y una captura de “Mi cuenta” con un correo personal visible.
5. La aplicación es académica/local: no incorpora roles, refresh tokens, rate limiting ni endurecimiento completo de producción.

## Archivos recomendados para el profesor

1. URL del repositorio y rama `Ana`.
2. `entrega_final/Informe_Academico_Integrado_Dia_1_Dia_2.docx` como informe académico principal.
3. `README.md` y `PROYECTO.md`.
4. Carpeta `entrega_final/`.
5. `docs/justificacion.md`.
6. `docs/investigacion_jwt_dia_2.md`.
7. `docs/diagrama-er.drawio`.
8. `docs/postman/Inventario_Empresarial.postman_collection.json`.
9. `docs/evidencias/Entregables_Dia_1_Inventario_Empresarial_COMPLETO.docx` como evidencia histórica independiente.
10. `docs/evidencias/final/`.

## Recomendación

El proyecto puede entregarse sin más cambios de programación. Antes de la presentación conviene completar el dato de estudiante del Word, revisar la exposición del correo personal en la captura de “Mi cuenta”, completar las capturas pendientes, exportar el ER y explicar verbalmente las restricciones de integridad y el uso de modales.
