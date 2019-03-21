const db = require("../data/dbConfig.js");

module.exports = {
  find,
  findBy,
  findById
};

function find() {
  return db("instructors as i")
    .join("users as u", "i.user_id", "u.user_id")
    .select(
      "i.instructor_id",
      "u.user_id",
      "u.username",
      "u.first_name",
      "u.last_name",
      "i.paypal_id"
    );
}

function findBy(filter) {
  return db("instructors").where(filter);
}

function findById(instructor_id) {
  return db("instructors")
    .where({ instructor_id })
    .first();
}
