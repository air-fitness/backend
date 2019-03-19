const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Users = require("../models/users-model.js");
const secrets = require("../secret/secrets");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { firstName, lastName, email, username, password, role } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log("user", user);
      console.log("req body", req.body);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome to the Big Show, ${
            user.username
          }! Here is a token just for you`,
          token
        });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    role: user.role
  };
  const options = {
    expiresIn: "1w"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
