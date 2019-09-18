const router = require("express").Router();

const bcrypt = require("bcryptjs");
const restricted = require("../auth/restricted-middleware");

const Users = require("./users-model");

router.get("/hash", (req, res) => {
  const name = req.query.name;
  // hash the name
  const hash = bcrypt.hashSync(name, 8); // use bcryptjs to hash the name
  res.send(`the hash for ${name} is ${hash}`);
  // use this to test localhost:5000/hash/?name=laura
});

router.post("/register", (req, res) => {
  let { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  // the 8 is a number and the higher the number the hardesr the password
  // is to hack. the higher the number, the SLOWER it is to generate though
  // 8 means round. it means 2 ^ 8 power.
  // always include in, 14 and up

  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
  // use this localhost:5000/api/register and put in username and password and u get back hash
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check password doing the below 49
      // *add to if statement* bcrypt.compareSync(password, user.password)
      // above takes the password and compares the hashes returns true or false
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user; // adding this from day 2 from restriced-middleware file
        // now you can not use headers and json with no body to get users
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/", restricted, (req, res) => {
  // only want to give someone who is authorized to give
  // access to the entire user list
  // so you must verify they are logged in via "restricted fx"
  // add username and password to headers in insomnia
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.status(500).json(err.message));
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({
          message: "You can checkout any time you like, but you can never leave"
        });
      } else {
        res.status(200).json({ message: "bye" });
      }
    });
  } else {
    res.status(200).json({ message: "already logged out" });
  }
});

module.exports = router;
