const router = require("express").Router();
const db = require("../data/dbConfig.js");
const restricted = require("../middleware/restricted-middleware.js");

const Instructors = require("../models/instructors-model.js");

router.get("/", restricted, (req, res) => {
  Instructors.find()
    .then(instructors => {
      res.json(instructors);
    })
    .catch(err => res.send(err));
});

// GET admin info
// gets classes by instructor id, returns those
// gets the categories, and then returns those

router.get("/tools", restricted, (req, res) => {
  const { instructor_id } = req.decodedJwt;
  db("classes")
    .where({ instructor_id })
    .then(filtered_classes => {
      res.status(200).json(filtered_classes);
      db("categories").then(categories => {
        res.status(200).json(categories);
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
module.exports = router;

// get Instructors by id w/ a list of their classes
router.get("/:instructor_id", restricted, (req, res) => {
  instructor_id = req.params.instructor_id;
  db("instructors")
    .where({ instructor_id })
    .first()
    .then(instructor => {
      if (instructor) {
        db("classes")
          .where({ instructor_id })
          .then(classes => {
            instructor.classes = classes;
            res.status(200).json(instructor);
          })
          .catch(error => console.log(error));
      } else {
        res.status(404).json({ error: "unable to find instructor" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
