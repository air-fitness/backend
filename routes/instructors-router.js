const router = require("express").Router();

const Instructors = require("../models/instructors-model.js");

router.get("/", (req, res) => {
  Instructors.find()
    .then(instructors => {
      res.json(instructors);
    })
    .catch(err => res.send(err));
});

module.exports = router;
