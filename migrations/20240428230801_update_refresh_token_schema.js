/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('refreshToken', (table) => {
    table.dropColumns(['isExpiry', 'isActive']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('refreshToken', (table) => {
    table.boolean('isActive').notNullable().defaultTo(true);
    table.boolean('isExpiry').notNullable().defaultTo(false);
  });
};
