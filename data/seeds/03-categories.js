exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("categories")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("categories").insert([
        {
          category_id: 1,
          category_name: "yoga"
        },
        {
          category_id: 2,
          category_name: "strength training"
        },
        {
          category_id: 3,
          category_name: "aerobics"
        }
      ]);
    });
};
