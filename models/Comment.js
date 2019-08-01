/************************************
 * Comment Schema and Model
 * 
 * @author Jennifer Grace
 * 
 * 08-01-2019
 ************************************/

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create comment schema
var CommentSchema = new Schema({
  title: String,
  body: String
});

// create model from Schema
var Comment = mongoose.model("Comment", CommentSchema);

// export the Comment model
module.exports = Comment;
