exports.up = function(knex, Promise) {
  return knex.schema.createTable("categories", categories => {
    categories.increments("category_id");

    categories.string("category_name", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("categories");
};
