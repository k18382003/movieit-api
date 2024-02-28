/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('invitation', (table) => {
    table
      .integer('sender')
      .unsigned()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('receiver')
      .unsigned()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('event_id')
      .unsigned()
      .references('event.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.boolean('need_action').notNullable().defaultTo(true);
    table.string('send_time').notNullable();
    table.string('read_time').nullable();
    table.primary(['sender', 'receiver', 'event_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('invitation');
};
