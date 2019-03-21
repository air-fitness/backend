exports.up = function(knex, Promise) {
  return knex.schema.createTable("attendees", attendees => {
    attendees
      .integer("class_time_id")
      .unsigned()
      .notNullable()
      .references("class_times.class_time_id")
      .onDelete("CASCADE");

    attendees
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.user_id");

    attendees.unique(["user_id", "class_time_id"]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("attendees");
};
