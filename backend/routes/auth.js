var express = require("express");
var router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticator } = require("otplib");
const qrCode = require("qrcode");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", function (req, res) {
  try {
    const { email, password } = req.body;
    const secret = authenticator.generateSecret();
    User.findOne({ email })
      .exec()
      .then(async (foundUser) => {
        if (!foundUser) {
          const user = new User({
            email,
            password: User.hashPassword(password),
            secret,
          });
          const qr = await qrCode.toDataURL(
            authenticator.keyuri(email, "2fa", secret)
          );
          await user.save();
          res.status(201).json({ email, qr });
        } else res.status(501).json({ message: "already registered!" });
      });
  } catch (ex) {
    console.log(ex);
    res.status(501).json({ message: ex });
  }
});
router.post("/register2fa", (req, res) => {
  const { email, code } = req.body;
  function error(e) {
    res.status(501).json({ message: e });
  }
  try {
    User.findOne({ email })
      .exec()
      .then((user) => {
        if (user) {
          const secret = user.secret;
          const isValid = authenticator.check(code, secret);
          if (!isValid) return error("invalid code");
          return res.status(201).json({ message: "registered successfully!" });
        } else error("user not registered!");
      });
  } catch (e) {
    error(e);
  }
});

router.post("/login", (req, res) => {
  const { email, password, code } = req.body;
  function error(e) {
    res.status(501).json({ message: e });
  }
  try {
    User.findOne({ email })
      .exec()
      .then((doc) => {
        if (doc.isValid(password)) {
          if (!authenticator.check(code, doc.secret)) throw "invalid code";
          //generate token
          const token = jwt.sign({ username: email }, "secret", {
            expiresIn: "1h",
          });
          res.status(200).json({ message: "login success", token });
        } else error("invalid password");
      })
      .catch((e) => {
        error(e);
      });
  } catch (e) {
    res.status(501).json({ message: e });
  }
});

router.get("/users", isAuthenticated, (req, res) => {
  res.status(200).json(tokenData);
});
router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.status(200).json({ message: "logout success" });
});

let tokenData;
function isAuthenticated(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) throw "error";
    else {
      const bearer = bearerHeader.split(" ");
      if (bearer.length == 2) {
        const token = bearer[1];
        jwt.verify(req.query.token, "secret", (err, _tokenData) => {
          if (err) throw err;
          else {
            tokenData = _tokenData;
            next();
          }
        });
      }
    }
  } catch (e) {
    res.status(401).json({ message: "token invalid" });
  }
}

module.exports = router;
