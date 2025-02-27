exports.up = function(knex) {
    return knex.schema
      .table('master_software', function(table) {
        table.string('slug', 255).nullable().unique();
      })
      .table('website_software', function(table) {
        table.string('slug', 255).nullable().unique();
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .table('website_software', function(table) {
        table.dropColumn('slug');
      })
      .table('master_software', function(table) {
        table.dropColumn('slug');
      });
  };
  