/************************************
 * Server File to Scrape Website
 * 
 * @author Jennifer Grace
 * 
 * 08-01-2019
 ************************************/

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require the models
var db = require("./models");

var PORT = 3000;
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNewsScraper";

// initialize Express
var app = express();

// middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// connection to Mongo DB
mongoose.connect("mongodb://localhost/mongoNewsScraper", { useNewUrlParser: true });


// route for scraping bbc.com
app.get("/scrape", function(req, res) {
    axios.get("https://www.bbc.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $("div.media").each(function(i, element) {
            var result = {};

            // result.image = $(this).children("div.media__image").children("div.responsive-image").find("img").attr("src");
            result.headline = $(this).children("div.media__content").children("h3.media__title").children("a").text();
            result.summary = $(this).children("div.media__content").children("p.media__summary").text();
            result.url = $(this).children("div.media__content").children("h3.media__title").find("a").attr("href");

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(error) {
                console.log(error);
            });
        });

        res.send("scraped");
    });
});

// get all articles from db
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// get an article by id and populatoin it with comment
app.get("/articles/:id", function(req, res) {
    db.Article.findById(req.params.id)
    .populate("comment")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// save/upate the comment on the Article
app.post("/articles/:id", function(req, res) {
    console.log("body: " + req.body);
    console.log("id: " + req.params.id);
    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle) 
    })
    .catch(function(error) {
        res.json(error);
    });
});

app.listen(PORT, function() {
    console.log("app running on port " + PORT);
});