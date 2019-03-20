const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Users = require("../models/users-model.js");
const secrets = require("../secret/secrets");

router.post("/register", (req, res) => {
  //   console.log("req body", req.body);
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    instructor,
    paypal_id
  } = req.body;

  const user = {
    first_name,
    last_name,
    email,
    username,
    password
  };
  console.log("user:", user);
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user, instructor, paypal_id)
    .then(({ user_id, error }) => {
      if (error) {
        res.status(500).json(error);
      } else {
        console.log("user_id", user_id);
        res.status(201).json(user_id);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log("user", user);
      console.log("req body", req.body);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome to AirFitness, ${
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
    subject: user.user_id,
    username: user.username
  };
  const options = {
    expiresIn: "1w"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
