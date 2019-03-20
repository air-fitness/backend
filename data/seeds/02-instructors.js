exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("instructors")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("instructors").insert([
        {
          instructor_id: 1,
          first_name: "Dhalsim",
          last_name: "StreetFighter",
          email: "dhalsim@dhalsim.com",
          password: "password",
          username: "yogidhalsim"
        },
        {
          instructor_id: 2,
          first_name: "Zangief",
          last_name: "StreetFighter",
          email: "zangief@zangief.com",
          password: "password",
          username: "strongmanzangief"
        },
        {
          instructor_id: 3,
          first_name: "Balrog",
          last_name: "StreetFighter",
          email: "balrog@balrog.com",
          password: "password",
          username: "boxerbalrog"
        }
      ]);
    });
};
