exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("instructors")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("instructors").insert([
        {
          instructor_id: 1,
          user_id: 2,
          paypal_id: "DhalsimPayPal"
        },
        {
          instructor_id: 2,
          user_id: 3,
          paypal_id: "ZangiefPayPal"
        },
        {
          instructor_id: 3,
          user_id: 4,
          paypal_id: "BalrogPayPal"
        }
      ]);
    });
};
