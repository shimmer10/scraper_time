/************************************
 * Article Schema and Model
 * 
 * @author Jennifer Grace
 * 
 * 08-01-2019
 ************************************/

 var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create article schema
var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: true
  },
  url: {
    type: String,
    required: true
  },
  // link to our comments
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// create model from Schema
var Article = mongoose.model("Article", ArticleSchema);

// export the Article model
module.exports = Article;
