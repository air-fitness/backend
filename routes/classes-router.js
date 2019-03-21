const router = require("express").Router();
const restricted = require("../middleware/restricted-middleware.js");

const db = require("../data/dbConfig.js");

// ********** READ METHODS ********** //

// GET all Classes
router.get("/", (req, res) => {
  db("classes")
    .then(classes => {
      res.status(200).json(classes);
    })
    .catch(error => {
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

// ********** CREATE METHODS ********** //

// POST a new class

router.post("/", restricted, (req, res) => {
  const newClass = req.body;
  const { instructor_id } = req.decodedJwt;
  console.log("newClass:", newClass);
  if (instructor_id) {
    db("classes")
      .insert({ ...newClass, instructor_id })
      .returning([
        "class_id",
        "category_id",
        "instructor_id",
        "start_time",
        "duration",
        "location",
        "class_name"
      ])
      .then(([class_obj]) => {
        res.status(201).json(class_obj);
      })
      .catch(error => {
        res.status(500).json({ message: "unable to add new class" });
      });
  } else {
    res.status(401).json({ message: "Access restricted to instructors" });
  }
});

// ********** UPDATE METHODS ********** //

// UPDATE an existing class

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
        "start_time",
        "duration",
        "location",
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

// if done by instructor:
// refund the punch card
// notify attendee
// clear the entrees from the attendees table

// if done by user:
// reverse the flow of signup for a class
// remove entry from attendee table
// increment punch card
// can't cancel class after it has happened (compare class.start_time to time.now)

router.delete("/:id", (req, res) => {
  const class_id = req.params.class_id;
  db("classes")
    .where({ class_id })
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
});

module.exports = router;
