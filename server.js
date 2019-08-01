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
var db = require("./modles");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNewsScraper";

// initialize Express
var app = express();

// middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// connection to Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// route for scraping bbc.com
app.get("/scrape", function(req, res) {
    axios.get("https://www.bbc.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $("h3.media__content").each(function(i, element) {
            var result = {};

            result.header = $(this).children("media_title").children("a").text();
            result.summary = $(this).childresn("media_summary").text();
            result.url = $(this).children("media_title").find("a").attr("href");

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