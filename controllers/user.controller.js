const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.register = (req, res, next) => {
  var user = new User();
  user.name = req.body.name;
  user.mobile = req.body.mobile;
  user.email = req.body.email;
  user.password = req.body.password;
  user.address = req.body.address;
  user.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      if (err.code == 11000)
        res.status(422).send(["Duplicate email address found"]);
      else return next(err);
    }
  });
};

module.exports.login = (req, res) => {
  User.findOne({ email: req.body.email }, async (error, user) => {
    if (error) {
      console.log(error);
    } else {
      if (!user) {
        res.status(401).send("invalid email");
      } else {
        const validPass = await bcrypt.compare(
          req.body.password,
          user.password
        );
        // console.log(validPass)
        if (!validPass) {
          res.status(401).send("Invailid password");
        } else {
          //   res.status(200).send(user);
          const payload = {
            check: true,
          };
          var token = jwt.sign(payload, config.secret, {
            expiresIn: 1440, // expires in 24 hours
          });
          res.json({
            message: "authentication done ",
            token: token,
          });
        }
      }
    }
  });
};
