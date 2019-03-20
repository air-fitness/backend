exports.up = function(knex, Promise) {
  return knex.schema.createTable("instructors", instructors => {
    instructors.increments("instructor_id");

    instructors.string("first_name", 128).notNullable();

    instructors.string("last_name", 128).notNullable();

    instructors
      .string("email", 128)
      .notNullable()
      .unique();

    instructors.string("password", 128).notNullable();

    instructors.string("username", 128).unique();

    instructors.string("paypal_id", 128);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("instructors");
};
