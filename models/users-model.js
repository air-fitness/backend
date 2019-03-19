const db = require("../data/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select(
    "id",
    "firstName",
    "lastName",
    "email",
    "username",
    "password",
    "role"
  );
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

async function add(user) {
  const [id] = await db("users")
    .insert(user)
    .returning("id");
  return findById(id);
}
