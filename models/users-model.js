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
  return db("users as u")
    .where({ username })
    .leftJoin("instructors as i", "u.user_id", "i.user_id")
    .select(
      "u.user_id",
      "u.username",
      "u.first_name",
      "u.last_name",
      "u.password",
      "i.instructor_id"
    )
    .first();
}

function findById(user_id) {
  return db("users")
    .where({ user_id })
    .first();
}

function add(user, instructor, paypal_id) {
  const { username, email } = user;

  return db("users")
    .where({ username })
    .orWhere({ email })
    .select("username", "email")
    .then(([check_unique]) => {
      console.log("check_unique:", check_unique);

      if (check_unique) {
        return {
          not_unique: check_unique.username === username ? "username" : "email"
        };
      } else {
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
    });
}
