'use strict';

const TIPOS = [
  { codigo: 'COMPRA', nombre: 'Compra confirmada', efecto: 'ENTRADA' },
  { codigo: 'VENTA', nombre: 'Venta confirmada', efecto: 'SALIDA' },
  { codigo: 'AJUSTE_ENTRADA', nombre: 'Ajuste positivo', efecto: 'ENTRADA' },
  { codigo: 'AJUSTE_SALIDA', nombre: 'Ajuste negativo', efecto: 'SALIDA' },
];

module.exports = {
  async up(queryInterface) {
    const [existentes] = await queryInterface.sequelize.query(
      'SELECT codigo FROM tipos_movimiento WHERE codigo IN (:codigos)',
      { replacements: { codigos: TIPOS.map(({ codigo }) => codigo) } },
    );
    const codigosExistentes = new Set(existentes.map(({ codigo }) => codigo));
    const ahora = new Date();
    const faltantes = TIPOS
      .filter(({ codigo }) => !codigosExistentes.has(codigo))
      .map((tipo) => ({ ...tipo, activo: true, createdAt: ahora, updatedAt: ahora }));

    if (faltantes.length) await queryInterface.bulkInsert('tipos_movimiento', faltantes);
  },

  // Son datos de catálogo que pueden quedar referenciados por movimientos históricos.
  // Una reversión no los elimina para preservar la trazabilidad y la integridad referencial.
  async down() {},
};
