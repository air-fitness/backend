exports.up = function(knex, Promise) {
  return knex.schema.createTable("classes", classes => {
    classes.increments("class_id");

    classes
      .integer("category_id")
      .unsigned()
      .notNullable()
      .references("categories.category_id");

    classes
      .integer("instructor_id")
      .unsigned()
      .notNullable()
      .references("instructors.instructor_id");

    classes.integer("duration").unsigned();

    classes.string("class_name", 128);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("classes");
};
