const db = require("../data/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select(
    "user_id",
    "first_name",
    "last_name",
    "email",
    "username",
    "password"
  );
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users")
    .where({ user_id })
    .first();
}

function add(user) {
  // ought to be a transaction
  return db("users")
    .insert(user)
    .returning("user_id")
    .then(user_id => {
      if (user.instructor) {
        return db("instructors")
          .insert({ user_id, paypal_id })
          .returning("instructor_id")
          .then(() => {
            return user_id;
          });
      } else return user_id;
    });
}
