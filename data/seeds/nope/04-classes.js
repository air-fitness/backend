exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("classes")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("classes").insert([
        {
          class_id: 1,
          category_id: 1,
          instructor_id: 1,
          start_time: "2015-03-25T12:00:00Z",
          duration: 1,
          location: "Central Park",
          class_name: "Dhalsim's Yoga Fire"
        },
        {
          class_id: 2,
          category_id: 2,
          instructor_id: 2,
          start_time: "2015-03-25T12:00:00Z",
          duration: 1,
          location: "Strongman Park",
          class_name: "Red Cyclone Strength Circuit"
        },
        {
          class_id: 3,
          category_id: 3,
          instructor_id: 3,
          start_time: "2015-03-25T12:00:00Z",
          duration: 1,
          location: "Boxer's Beach",
          class_name: "Balrog's Aerobic Boxing Blast"
        }
      ]);
    });
};
