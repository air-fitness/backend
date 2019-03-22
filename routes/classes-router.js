const router = require("express").Router();
const restricted = require("../middleware/restricted-middleware.js");
const moment = require("moment");

const db = require("../data/dbConfig.js");

// ***************** ENDPOINTS FOR CLASSES ***************** //

// ********** READ METHODS ********** //

// GET all Classes
router.get("/", (req, res) => {
  db("classes as c")
    .join("categories as cat", "c.category_id", "cat.category_id")
    .join("instructors as i", "c.instructor_id", "i.instructor_id")
    .join("users as u", "i.user_id", "u.user_id")
    .select(
      "c.class_id",
      "c.class_name",
      "c.category_id",
      "cat.category_name",
      "c.duration",
      "i.instructor_id",
      "u.username as instructor_username",
      "u.first_name as instructor_first_name",
      "u.last_name as instructor_last_name"
    )
    .then(classes => {
      res.status(200).json(classes);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Get Passes by user_id
router.get("/passes", restricted, (req, res) => {
  const { user_id } = req.decodedJwt;
  db("punch_cards as p")
    .where("p.user_id", user_id)
    .join("classes as c", "p.class_id", "c.class_id")
    .join("categories as cat", "c.category_id", "cat.category_id")
    .join("instructors as i", "c.instructor_id", "i.instructor_id")
    .join("users as u", "i.user_id", "u.user_id")
    .select(
      "p.class_id",
      "c.class_name",
      "c.category_id",
      "cat.category_name",
      "c.duration",
      "i.instructor_id",
      "u.username as instructor_name",
      "p.punch_count"
    )
    .orderBy("p.punch_count", "desc")
    .then(filtered_passes => {
      res.status(200).json(filtered_passes);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// GET class_times by user_id (using punch_cards.class_id, joining attendees by class_time_id and user_id)
router.get("/calendar", restricted, (req, res) => {
  const { user_id } = req.decodedJwt;

  console.log("user_id:", user_id);

  return db("punch_cards as p")
    .where("p.user_id", user_id)
    .join("class_times as ct", "p.class_id", "ct.class_id")
    .join("classes as c", "ct.class_id", "c.class_id")
    .join("instructors as i", "c.instructor_id", "i.instructor_id")
    .join("users as u", "i.user_id", "u.user_id")
    .leftJoin("attendees as a", "ct.class_time_id", "a.class_time_id")
    .where(
      "ct.start_time",
      ">",
      moment
        .utc()
        .startOf("day")
        .toDate()
    )
    .select(
      "p.class_id",
      "c.class_name",
      "i.instructor_id",
      "u.username as instructor_name",
      "ct.class_time_id",
      "ct.start_time",
      "ct.end_time",
      "ct.location",
      "a.user_id as attending",
      "p.punch_count"
    )
    .orderBy("ct.start_time")
    .then(class_times => {
      res.status(200).json(class_times);
    })
    .catch(error => {
      console.log("error:", error);

      res.status(500).json(error);
    });
});

// GET classes by ID
router.get("/:class_id", (req, res) => {
  db("classes")
    .where({ class_id: req.params.class_id })
    .then(filtered_classes => {
      console.log("filtered_classes:", filtered_classes);
      res.status(200).json(filtered_classes);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// GET classes by instructor/:instructor_id
router.get("/by_instructor/:instructor_id", (req, res) => {
  db("classes")
    .where({ instructor_id: req.params.instructor_id })
    .then(filtered_classes => {
      console.log("filtered_classes:", filtered_classes);
      res.status(200).json(filtered_classes);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// ********** CREATE METHODS ********** //

// POST a new class

// Protected route - only an instrcutor may post a new class

router.post("/", restricted, (req, res) => {
  const newClass = req.body;
  const { instructor_id } = req.decodedJwt;
  console.log("newClass + instructor_id:", { ...newClass, instructor_id });

  if (instructor_id) {
    db("classes")
      .insert({ ...newClass, instructor_id })
      .returning([
        "class_id",
        "category_id",
        "instructor_id",
        "duration",
        "class_name"
      ])
      .then(([class_obj]) => {
        res.status(201).json(class_obj);
      })
      .catch(error => {
        res.status(500).json({ error, message: "unable to add new class" });
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

// ********** UPDATE METHODS ********** //

// UPDATE an existing class

// this will check to make sure that the user updating
// the class is the instructor by whom the class was created

router.put("/:class_id", restricted, (req, res) => {
  const class_id = req.params.class_id;
  const { instructor_id } = req.decodedJwt;
  if (instructor_id) {
    db("classes")
      .where({ class_id, instructor_id })
      .update(req.body)
      .returning([
        "class_id",
        "category_id",
        "instructor_id",
        "duration",
        "class_name"
      ])
      .then(([updated_class]) => {
        if (updated_class) {
          res.status(200).json(updated_class);
        } else {
          res.status(404).json({ message: "could not locate intended class" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

// ********** DELETE METHODS ********** //

// DELETE a class

router.delete("/:class_id", restricted, (req, res) => {
  const class_id = req.params.class_id;
  const { instructor_id } = req.decodedJwt;
  if (instructor_id) {
    db("classes")
      .where({ class_id, instructor_id })
      .del()
      .then(count => {
        if (count > 0) {
          res.status(204).json({ message: "class successfully deleted" });
        } else {
          res.status(404).json({ message: "unable to locate desired class" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

// ***************** ENDPOINTS FOR CLASS PASSES ***************** //

// ********** CREATE METHODS ********** //

// Purchase a new punch pass to an existing class
router.post("/purchase_pass/:class_id", restricted, (req, res) => {
  const class_id = req.params.class_id;
  const { user_id } = req.decodedJwt;

  return db("punch_cards")
    .where({ class_id, user_id })
    .increment("punch_count", 10)
    .then(updated_count => {
      console.log("updated_count:", updated_count);
      // check to see whether a pass has been previously purchased
      if (!updated_count) {
        return (
          db("punch_cards")
            // if no previously purchased pass, grab a pass for the first time and return this message
            .insert({ class_id, user_id })
            .returning(["class_id", "user_id", "punch_count"])
            .then(() => {
              res.status(201).json({ message: "punch pass purchased!" });
            })
        );
      } else {
        // if user has already purchased a pass for the class in question, return a message
        res.status(201).json({ message: "additional punch pass purchased!" });
      }
    })
    .catch(err => {
      return status(500).json(err);
    });
});

// ***************** ENDPOINTS FOR CLASS_TIMES ***************** //
// ********** READ METHODS ********** //

// GET class_times by class_id
// return only classes whose timestamp is later than now

// could change this to show all classes starting at today

router.get("/class_times/:class_id", restricted, (req, res) => {
  const class_id = req.params.class_id;
  console.log("moment().toDate():", moment.utc().toDate());
  return db("class_times")
    .where({ class_id })
    .andWhere(
      "start_time",
      ">",
      moment
        .utc()
        .startOf("day")
        .toDate()
    )
    .orderBy("start_time")
    .then(class_list => {
      res.status(200).json(class_list);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// ********** CREATE METHODS ********** //

// Post a new class_time
router.post("/class_times/:class_id", restricted, (req, res) => {
  const { class_id } = req.params;
  const { instructor_id } = req.decodedJwt;
  const { start_time, end_time, location } = req.body;

  console.log("class_id:", class_id);
  console.log("instructor_id:", instructor_id);
  console.log("start_time:", start_time);

  if (instructor_id) {
    return db("classes")
      .where({ instructor_id, class_id })
      .then(([class_obj]) => {
        if (!class_obj) {
          res.status(404).json({ message: "class not found" });
        } else {
          return db("class_times")
            .insert({ class_id, start_time, end_time, location })

            .returning(["class_time_id", "class_id", "start_time", "end_time"])
            .then(([created_class_time]) => {
              console.log(created_class_time.start_time);
              res.status(200).json(created_class_time);
            });
        }
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

// Sign up for a time slot for a class to which you've already purchased a pass
router.post("/attend/:class_id/:class_time_id", restricted, (req, res) => {
  const { class_id, class_time_id } = req.params;
  const { user_id } = req.decodedJwt;

  return db.transaction(trx => {
    // I'd really like to reduce this to two queries but I don't know how
    return trx("class_times")
      .where({ class_time_id, class_id })
      .then(([class_time_obj]) => {
        if (!class_time_obj) {
          console.log("Error: class_time does not belong to that class");
          trx.rollback;
        } else {
          return trx("punch_cards")
            .where({ class_id, user_id })
            .andWhere("punch_count", ">", 0)
            .decrement("punch_count", 1)
            .then(count => {
              if (!count) {
                console.log("Error: no passes for that class");
                res
                  .status(403)
                  .json({ error: "No remaining uses for that class" });
              } else {
                return trx("attendees")
                  .insert({ user_id, class_time_id })
                  .returning(["user_id", "class_time_id"])
                  .then(([attendee_obj]) => {
                    if (!attendee_obj) {
                      console.log(
                        "Error: something went wrong with inserting into attendees (possible duplicate entry)"
                      );
                      trx.rollback;
                    } else {
                      res.status(201).json(attendee_obj);
                    }
                  });
              }
            })
            .catch(error => {
              res.status(500).json(error);
            });
        }
      });
  });
});

// ********** DELETE METHODS ********** //

// if done by instructor:
// refund the punch card
// notify attendee
// clear the entrees from the attendees table

// if done by user:
// reverse the flow of signup for a class
// remove entry from attendee table
// increment punch card
// can't cancel class after it has happened (compare class.start_time to time.now)

// DELETE a class time
router.delete("/:class_time_id", restricted, (req, res) => {
  const class_time_id = req.params.class_time_id;
  const { instructor_id } = req.decodedJwt;

  if (instructor_id) {
    // I'd really like to reduce this to a single query but I don't know how
    return db("class_times as ct")
      .where({ class_time_id })
      .join("classes as c", "ct.class_time_id", "c.class_time_id")
      .select("c.instructor_id")
      .then(([class_info]) => {
        if (instructor_id !== class_info.instructor_id) {
          return { error: "you are not the instructor for this class" };
        } else {
          return db("class_times")
            .where({ class_time_id })
            .del();
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

module.exports = router;
