exports.up = function(knex, Promise) {
  return knex.schema.createTable("punch_cards", punch_cards => {
    punch_cards
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.user_id");

    punch_cards
      .integer("class_id")
      .unsigned()
      .notNullable()
      .references("classes.class_id")
      .onDelete("CASCADE");

    punch_cards
      .integer("punch_count")
      .unsigned()
      .notNullable()
      .defaultTo(10);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("punch_cards");
};
