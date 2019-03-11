var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose");

// App Config

mongoose.connect("mongodb://localhost/news_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose Model Config

var newsSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var News = mongoose.model("News", newsSchema);

// RESTful Routes

app.get("/", function(req, res) {
  res.redirect("/news");
});

//Index Route

app.get("/news", function(req, res) {
  News.find({}, function(err, news) {
    if (err) {
      console.log("Error");
    } else {
      res.render("index", { news: news });
    }
  });
});

//New Route
app.get("/news/new", function(req, res) {
  res.render("new");
});

//Create Route

app.post("/news", function(req, res) {
  // create news
  console.log(req.body);
  req.body.news.body = req.sanitize(req.body.news.body);
  console.log("==================================");
  console.log(req.body);
  News.create(req.body.news, function(err, newNews) {
    if (err) {
      res.render("new");
    } else {
      // then redirect to index
      res.redirect("/news");
    }
  });
});

// Show Route

app.get("/news/:id", function(req, res) {
  News.findById(req.params.id, function(err, foundNews) {
    if (err) {
      res.redirect("/news");
    } else {
      res.render("show", { news: foundNews });
    }
  });
});

// Edit Route

app.get("/news/:id/edit", function(req, res) {
  News.findById(req.params.id, function(err, foundNews) {
    if (err) {
      res.redirect("/news");
    } else {
      res.render("edit", { news: foundNews });
    }
  });
});

// Update Route

app.put("/news/:id", function(req, res) {
  req.body.news.body = req.sanitize(req.body.news.body);
  News.findByIdAndUpdate(req.params.id, req.body.news, function(
    err,
    updatedNews
  ) {
    if (err) {
      res.redirect("/news");
    } else {
      res.redirect("/news/" + req.params.id);
    }
  });
});

// Delete Route

app.delete("/news/:id", function(req, res) {
  // Delete news post
  News.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/news");
    } else {
      res.redirect("/news");
    }
  });
});

app.listen(8000, function() {
  console.log("Server is Running");
});
