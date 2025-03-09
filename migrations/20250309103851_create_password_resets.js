/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('password_resets', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().references('user.email').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('token').notNullable();
    table.timestamp('expires_after').notNullable();
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('password_resets');
};
