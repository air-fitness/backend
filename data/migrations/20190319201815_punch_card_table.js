exports.up = function(knex, Promise) {
  return knex.schema.createTable("punch_card", punch_card => {
    punch_card
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users");

    punch_card
      .integer("instructor_id")
      .unsigned()
      .notNullable()
      .references("instructor_id")
      .inTable("instructors");

    punch_card
      .integer("class_id")
      .unsigned()
      .notNullable()
      .references("class_id")
      .inTable("classes");

    punch_card
      .integer("punch_count")
      .unsigned()
      .notNullable()
      .defaultTo(10);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("punch_card");
};
