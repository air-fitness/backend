exports.up = function(knex, Promise) {
  return knex.schema.createTable("instructors", instructors => {
    instructors.increments("instructor_id");

    instructors
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.user_id");

    instructors.string("paypal_id", 128);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("instructors");
};
