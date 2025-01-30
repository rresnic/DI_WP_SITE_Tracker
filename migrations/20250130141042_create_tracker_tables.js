/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(table) {
      table.increments('users_id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable(); // 'admin', 'user', etc.
      table.string('token').nullable(); // For storing refresh tokens
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('last_login').nullable();
    })
    .createTable('master_software', function(table) {
      table.increments('ms_id').primary();
      table.string('name').notNullable();
      table.enum('type', ['plugin', 'theme']).notNullable();
      table.string('latest_version').notNullable();
      table.date('last_update_date').notNullable();
      table.text('update_notes').nullable();
      table.string('update_url').nullable();
    })
    .createTable('user_websites', function(table) {
      table.increments('uw_id').primary();
      table.integer('user_id').unsigned().notNullable().references('users_id').inTable('users').onDelete('CASCADE');
      table.string('website_url').notNullable();
      table.timestamp('last_update_performed').nullable();
    })
    .createTable('website_software', function(table) {
      table.increments('ws_id').primary();
      table.integer('website_id').unsigned().notNullable().references('uw_id').inTable('user_websites').onDelete('CASCADE');
      table.integer('software_id').unsigned().notNullable().references('ms_id').inTable('master_software').onDelete('CASCADE');
      table.string('installed_version').notNullable();
      table.date('installed_version_date').notNullable();
    })
    .createTable('vulnerabilities', function(table) {
      table.increments('vulnerability_id').primary();
      table.string('software_name').notNullable();
      table.string('affected_versions').notNullable();
      table.string('severity').notNullable();
      table.text('description').notNullable();
      table.string('reference_url').nullable();
      table.timestamp('reported_date').defaultTo(knex.fn.now());
      table.date('last_updated').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('vulnerabilities')
    .dropTableIfExists('website_software')
    .dropTableIfExists('user_websites')
    .dropTableIfExists('master_software')
    .dropTableIfExists('users');
};