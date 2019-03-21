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
    "username"
  );
}

function findBy(username) {
  return db("users")
    .where(username)
    .leftJoin("instructors", "users.user_id", "instructors.user_id")
    .first();
}

function findById(user_id) {
  return db("users")
    .where({ user_id })
    .first();
}

function add(user, instructor, paypal_id) {
  return db.transaction(trx => {
    return trx("users")
      .insert(user)
      .returning(["user_id", "first_name", "last_name", "username"])
      .then(([user_obj]) => {
        const { user_id } = user_obj;
        if (!user_id) {
          trx.rollback;
        } else {
          console.log("user_id:", user_id);
          if (instructor) {
            console.log("instructor:", instructor);
            console.log("paypal_id:", paypal_id);
            return trx("instructors")
              .insert({ user_id: user_id, paypal_id })
              .returning("instructor_id")
              .then(([instructor_id]) => {
                if (!instructor_id) {
                  trx.rollback;
                } else {
                  console.log("insructor_id:", instructor_id);
                  console.log("user_obj:", user_obj);
                  return { ...user_obj, instructor_id };
                }
              });
          } else return user_obj;
        }
      })
      .catch(error => {
        console.log("error:", error);
        return { error };
      });
  });
}
