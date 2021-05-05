
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const ejs = require("ejs")
app.set("view engine", "ejs")

app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("main");
  });

  const listener = app.listen(3000, () => {
    console.log("The app is listening on port " + listener.address().port);
  });