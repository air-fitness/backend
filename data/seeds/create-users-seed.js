exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          firstName: "Josh",
          lastName: "Armantrout",
          email: "josh@josh.com",
          password: "joshpassword",
          username: "josharmantrout",
          role: "student"
        },
        {
          id: 2,
          firstName: "Joram",
          lastName: "Clervius",
          email: "joram@email.com",
          password: "jorampassword",
          username: "jclervius",
          role: "instructor"
        }
      ]);
    });
};
