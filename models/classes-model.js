const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  remove,
  update
};

function find() {
  return db("classes").select(
    "class_id",
    "category_id",
    "instructor_id",
    "start_time",
    "duration",
    "location",
    "class_name"
  );
}

function findBy(filter) {
  return db("classes").where(filter);
}

function findById(class_id) {
  return db("classes")
    .where({ class_id })
    .first();
}

// need functions to do the following:
// create a class
// view list of classes
// search class by filter
// search class by
