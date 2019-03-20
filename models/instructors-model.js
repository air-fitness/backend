const db = require("../data/dbConfig.js");

module.exports = {
  find,
  findBy,
  findById
};

function find() {
  return db("instructors").select("instructor_id", "paypal_id", "user_id");
}

function findBy(filter) {
  return db("instructors").where(filter);
}

function findById(instructor_id) {
  return db("instructors")
    .where({ instructor_id })
    .first();
}
