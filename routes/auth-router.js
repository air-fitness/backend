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
    .then(
      ({
        user_id,
        username,
        first_name,
        last_name,
        instructor_id,
        not_unique,
        error
      }) => {
        if (error) {
          res.status(500).json({ error });
        } else if (not_unique) {
          res.status(403).json({ not_unique });
        } else {
          const token = generateToken({
            user_id,
            username,
            first_name,
            last_name,
            instructor_id
          });
          res.status(200).json({
            message: `Welcome to AirFitness, ${username}! Here is a token just for you`,
            token,
            user_id,
            username,
            first_name,
            last_name,
            instructor_id
          });
        }
      }
    )
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy(username)
    .then(user_obj => {
      console.log("user_obj", user_obj);
      console.log("req body", req.body);
      if (user_obj && bcrypt.compareSync(password, user_obj.password)) {
        const token = generateToken(user_obj);
        res.status(200).json({
          message: `Welcome to AirFitness, ${
            user_obj.username
          }! Here is a token just for you`,
          token,
          user_id: user_obj.user_id,
          username: user_obj.username,
          first_name: user_obj.first_name,
          last_name: user_obj.last_name,
          instructor_id: user_obj.instructor_id
        });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function generateToken(user_obj) {
  const payload = {
    user_id: user_obj.user_id,
    username: user_obj.username,
    first_name: user_obj.first_name,
    last_name: user_obj.last_name,
    instructor_id: user_obj.instructor_id
  };
  const options = {
    expiresIn: "1w"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
