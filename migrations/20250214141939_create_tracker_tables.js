exports.up = function(knex) {
    return knex.schema
      // Create 'user' table
      .createTable('user', function(table) {
        table.increments('user_id').primary();
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('role', 255).notNullable();
        table.string('token', 255);
        table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp('last_login', { useTz: true });
      })
      // Create 'master_software' table
      .createTable('master_software', function(table) {
        table.increments('ms_id').primary();
        table.string('name', 255).notNullable();
        table.text('type').notNullable();
        table.string('latest_version', 255).notNullable();
        table.date('last_update_date').notNullable();
        table.text('update_notes');
        table.string('update_url', 255);
        table.unique(['name', 'type']);
        table.check('type = ANY (ARRAY[\'plugin\', \'theme\'])');
      })
      // Create 'user_websites' table
      .createTable('user_websites', function(table) {
        table.increments('uw_id').primary();
        table.integer('user_id').notNullable().references('user_id').inTable('user').onUpdate('NO ACTION').onDelete('CASCADE');
        table.string('website_url', 255).notNullable();
        table.timestamp('last_update_performed', { useTz: true });
      })
      // Create 'website_software' table
      .createTable('website_software', function(table) {
        table.increments('ws_id').primary();
        table.integer('website_id').notNullable().references('uw_id').inTable('user_websites').onUpdate('NO ACTION').onDelete('CASCADE');
        table.integer('software_id').references('ms_id').inTable('master_software').onUpdate('NO ACTION').onDelete('SET NULL');
        table.string('installed_version', 255).notNullable();
        table.date('installed_version_date').notNullable();
        table.text('name').notNullable();
        table.text('type').notNullable();
        table.unique(['website_id', 'name']);
        table.check('type = ANY (ARRAY[\'plugin\', \'theme\'])');
      })
      // Create 'vulnerabilities' table
      .createTable('vulnerabilities', function(table) {
        table.increments('vulnerability_id').primary();
        table.string('software_name', 255).notNullable();
        table.string('affected_versions', 255).notNullable();
        table.string('severity', 255).notNullable();
        table.text('description').notNullable();
        table.string('reference_url', 255);
        table.timestamp('reported_date', { useTz: true }).defaultTo(knex.fn.now());
        table.date('last_updated');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('vulnerabilities')
      .dropTableIfExists('website_software')
      .dropTableIfExists('user_websites')
      .dropTableIfExists('master_software')
      .dropTableIfExists('user');
  };  
