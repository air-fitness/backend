const router = require("express").Router();

const Users = require("../models/users-model.js");

const restricted = require("../middleware/restricted-middleware.js");

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
