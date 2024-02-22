/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('user', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('profile', (table) => {
      table.increments('id').primary();
      table.string('postalcode').notNullable();
      table.string('genres').nullable();
      table.string('snacks').nullable();
      table.string('preferdays').nullable();
      table.string('bio').nullable();
      table
        .integer('user_id')
        .unsigned()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('event', (table) => {
      table.increments('id').primary();
      table.string('movie_name').notNullable();
      table.string('show_time').notNullable();
      table.string('cinema').notNullable();
      table.string('postal_code').notNullable();
      table.string('address').notNullable();
      table.string('notes').nullable();
      table.integer('max_people').nullable();
      table
        .integer('host')
        .unsigned()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('participants', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
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
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table
        .timestamp('updated_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('message', (table) => {
      table.increments('id').primary();
      table
        .integer('sender')
        .unsigned()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table
        .integer('receiver')
        .unsigned()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table.string('messages').notNullable();
      table.string('send_time').notNullable();
      table.string('read_time').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('user')
    .dropTable('profile')
    .dropTable('participants')
    .dropTable('message');
};
