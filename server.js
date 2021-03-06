"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");

var cors = require("cors");

var app = express();

const dns = require("dns");

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
// mongoose.connect(process.env.DB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const links = [];
let id = 0;

app.post("/api/shorturl/new", (req, res) => {
  const { url } = req.body;

  console.log(req.body);

  const noHTTPSurl = url.replace(/^https?:\/\//, "");

  dns.lookup(noHTTPSurl, (err) => {
    if (err) {
      return res.json({
        error: "invalid URL",
      });
    } else {
      id++;

      const link = {
        original_url: url,
        short_url: `${id}`,
      };
      links.push(link);

      return res.json(link);
    }
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const { id } = req.params;

  const link = links.find((l) => l.short_url === id);

  if (link) {
    return res.redirect(link.original_url);
  } else {
    return res.json({
      error: "No short url",
    });
  }
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
