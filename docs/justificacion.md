# Justificación académica

## Introducción

El control de inventarios es una actividad necesaria para conocer qué productos posee una organización, cuántas unidades están disponibles y con cuáles proveedores se relaciona cada artículo. Aunque una empresa pequeña puede comenzar este proceso mediante anotaciones manuales o archivos de hojas de cálculo, estas alternativas presentan dificultades conforme aumenta la cantidad de información administrada.

El Sistema de Gestión de Inventario Empresarial se desarrolla como una solución académica para organizar productos, categorías y proveedores en una aplicación web centralizada. Su propósito es demostrar la integración de una interfaz de usuario, una API REST y una base de datos relacional, aplicando validaciones e integridad referencial.

## Problemática de la gestión manual

Cuando el inventario se registra en cuadernos, documentos independientes o archivos compartidos sin reglas uniformes, pueden aparecer datos repetidos, cantidades incorrectas y dificultades para identificar la versión más reciente de la información. También existe el riesgo de asignar nombres diferentes al mismo tipo de producto, perder los datos de contacto de un proveedor o registrar artículos sin una clasificación adecuada.

La revisión manual de estos registros consume tiempo y depende de que cada persona mantenga el mismo criterio. Además, una modificación accidental puede pasar inadvertida si no existen controles sobre campos obligatorios, valores numéricos o relaciones entre los datos.

## Organización de productos, categorías y proveedores

El proyecto separa la información en tres entidades principales. Las categorías permiten clasificar el catálogo y evitar que los productos se gestionen como una lista sin estructura. Los proveedores conservan la información básica de las fuentes de abastecimiento. Los productos reúnen los datos operativos del inventario: nombre, código, precio, cantidad y las relaciones con su categoría y proveedor.

Esta organización reduce la duplicación de información y facilita las consultas. Por ejemplo, el nombre de una categoría o de un proveedor se almacena una sola vez y puede relacionarse con varios productos.

## Beneficios de centralizar la información

Una base centralizada proporciona un punto común para registrar y consultar el inventario. Entre sus beneficios se encuentran:

- Consulta consistente de productos, existencias y precios.
- Clasificación uniforme mediante categorías.
- Disponibilidad de los datos de contacto de proveedores.
- Reducción de duplicados mediante campos únicos.
- Actualización inmediata de los listados y del Dashboard.
- Separación clara entre presentación, reglas de negocio y persistencia.

La centralización no elimina por sí sola todos los errores humanos, pero permite aplicar reglas que los registros manuales normalmente no garantizan.

## Integridad de los datos

La integridad es un aspecto central del sistema. Cada producto debe estar relacionado con una categoría y un proveedor existentes. Las claves foráneas impiden crear relaciones inválidas y la regla `ON DELETE RESTRICT` evita eliminar una categoría o un proveedor mientras tenga productos asociados. La regla `ON UPDATE CASCADE` mantiene la relación si cambia una clave referenciada.

También se aplican restricciones de unicidad al nombre de las categorías y al código de los productos. Los precios y cantidades no admiten valores negativos, los campos obligatorios no pueden quedar vacíos y los correos electrónicos se validan cuando se proporcionan. Estas reglas se implementan en los modelos, controladores y migraciones, de acuerdo con la responsabilidad de cada capa.

## Ventajas de una aplicación web

Una aplicación web permite utilizar el sistema desde un navegador sin instalar una interfaz de escritorio específica. La navegación entre módulos se realiza sin recargar toda la página y el diseño responsive adapta los principales elementos a computadoras, tablets y teléfonos.

La separación entre cliente y servidor también permite que la API sea consumida por otras interfaces en el futuro, siempre que se respeten sus reglas y endpoints. En este proyecto, el frontend y el backend se ejecutan localmente como aplicaciones independientes comunicadas mediante HTTP y JSON.

## Justificación de las tecnologías

### React y Vite

React permite construir la interfaz mediante componentes reutilizables y administrar estados como cargas, formularios, mensajes y confirmaciones. React Router DOM organiza la navegación entre el Dashboard y los módulos. Vite proporciona un entorno de desarrollo rápido y un proceso de compilación sencillo para una aplicación académica moderna.

### Node.js y Express

Node.js permite utilizar JavaScript en el servidor, lo que mantiene un lenguaje común en todo el proyecto. Express facilita la definición de rutas REST y middlewares para JSON, CORS, validaciones de parámetros y manejo centralizado de errores. Su estructura es suficiente para el alcance planteado sin incorporar complejidad innecesaria.

### Sequelize

Sequelize funciona como capa de acceso entre la aplicación y MySQL. Los modelos representan las entidades y sus asociaciones, mientras Sequelize CLI administra el esquema mediante migraciones reproducibles. Esto permite crear la misma estructura en otra computadora sin depender de cambios manuales en la base de datos.

### MySQL

MySQL es apropiado porque la información posee relaciones claras y requiere restricciones de integridad. Las claves primarias, claves foráneas, valores únicos y tipos numéricos se expresan directamente en un modelo relacional. Además, es una tecnología ampliamente utilizada y adecuada para fines académicos.

## Alcance y funcionalidades desarrolladas

El alcance comprende:

- Gestión completa de categorías.
- Gestión completa de proveedores.
- Gestión completa de productos.
- Asociación obligatoria de productos con categorías y proveedores.
- Validaciones de datos y manejo de conflictos.
- API REST con quince endpoints CRUD y un endpoint de salud.
- Dashboard con cantidades obtenidas de la API.
- Interfaz responsive con estados de carga, mensajes y confirmación de eliminación.
- Configuración mediante variables de entorno.
- Migraciones para reproducir la estructura MySQL.

No forman parte del alcance la autenticación, la gestión de usuarios, ventas, compras, movimientos históricos, reportes avanzados o el despliegue público. Estas funciones podrían considerarse en una ampliación posterior, pero no son necesarias para demostrar los objetivos del proyecto.

## Conclusión

El Sistema de Gestión de Inventario Empresarial responde a la necesidad de organizar información que, manejada manualmente, puede volverse inconsistente y difícil de consultar. La solución integra tecnologías de frontend, backend y base de datos para ofrecer operaciones CRUD, relaciones verificables y una experiencia de uso clara.

El proyecto no pretende sustituir un sistema empresarial de gran escala. Su valor académico consiste en aplicar una arquitectura full stack coherente, mantener la integridad de los datos y documentar un proceso reproducible desde la instalación hasta las pruebas funcionales.
