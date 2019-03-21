exports.up = function(knex, Promise) {
  return knex.schema.createTable("class_times", class_times => {
    class_times.increments("class_time_id");

    class_times
      .integer("class_id")
      .unsigned()
      .notNullable()
      .references("classes.class_id")
      .onDelete("CASCADE");

    class_times.datetime("start_time").notNullable();

    class_times.datetime("end_time");

    class_times.string("location").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("class_times");
};
