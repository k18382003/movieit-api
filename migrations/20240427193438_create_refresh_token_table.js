/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('refreshToken', (table) => {
    table.increments('id').primary();
    table
      .integer('userId')
      .unsigned()
      .notNullable()
      .references('user.id')
      .onDelete('CASCADE');
    table.string('token').notNullable();
    table
      .dateTime('expiry')
      .notNullable()
    table.boolean('isExpiry').notNullable().defaultTo(false);
    table.boolean('revoke');
    table.boolean('isActive').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table('refreshToken', (table) => {
      table.dropForeign('userid');
    })
    .dropTable('refreshToken');
};
