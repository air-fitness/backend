exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          user_id: 1,
          first_name: "Josh",
          last_name: "Armantrout",
          email: "josh@josh.com",
          password: "joshpassword",
          username: "josharmantrout"
        },
        {
          user_id: 2,
          first_name: "Dhalsim",
          last_name: "StreetFighter",
          email: "dhalsim@dhalsim.com",
          password: "password",
          username: "yogidhalsim"
        },
        {
          user_id: 3,
          first_name: "Zangief",
          last_name: "StreetFighter",
          email: "zangief@zangief.com",
          password: "password",
          username: "strongmanzangief"
        },
        {
          user_id: 4,
          first_name: "Balrog",
          last_name: "StreetFighter",
          email: "balrog@balrog.com",
          password: "password",
          username: "boxerbalrog"
        }
      ]);
    });
};
