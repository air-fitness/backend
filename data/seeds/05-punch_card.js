exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("punch_cards")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("punch_cards").insert([
        {
          user_id: 1,
          class_id: 1,
          punch_count: 10
        }
      ]);
    });
};
