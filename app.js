require("./config/config");
require("./models/db");

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const rtsIndex = require("./routes/index.router");

var app = express();

// app.set('Secret', config.secret);

// use morgan to log requests to the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use("/api", rtsIndex);

// Protected Routes
const ProtectedRoutes = express.Router();
app.use("/api", ProtectedRoutes);
ProtectedRoutes.use((req, res, next) => {
  // check header for the token
  var token = req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({ message: "invalid token" });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    res.send({
      message: "No token provided.",
    });
  }
});

ProtectedRoutes.get("/getAllProducts", (req, res) => {
  let products = [
    {
      id: 1,
      name: "cheese",
    },
    {
      id: 2,
      name: "carottes",
    },
  ];

  res.json(products);
});

// error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server started at port : ${process.env.PORT}`)
);
