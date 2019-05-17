/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

// Importing our model
var Book = require('../models/Book');


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      
      Book
        .find()
        .select({ title: 1, _id:1, commentcount:1 })
        .then(docs => res.json(docs))
        .catch(err => console.log(err));
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let newBook = new Book({
        title: title,
        comments: []
      });
      newBook
        .save()
        .then((doc) => {
          res.json('Book saved');
        })
        .catch(err => {
          console.log(err);
          res.send('Error! Check the server console for more info.');
        });
    })
    
    .delete(function(req, res){
      Book
        .deleteMany({})
        .then(() => {
          res.send('complete delete successful')
          console.log('All books deleted')
        })
        .catch(err => {
          console.log(err);
          res.send('Error! Check the server console for more info.');
        })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book
        .findById(bookid)
        .select({ title:1, _id:1, comments:1 })
        .then(doc => {
          if (doc === null) res.send('Book not found!')
          else {
            res.json(doc);
          }
        })
        .catch(err => {
          console.log(err);
          res.send('Error! Check the server console for more info.');
        })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      if (comment) {
      Book
        .findById(bookid)
        .then(doc => {
          if (doc === null) res.send('Book not found!');
          else {
            doc.comments.push(comment);
            doc.commentcount+=1;
            doc
              .save()
              .then(() => res.json(doc))
              .catch(err => {
                res.send('Error while adding a comment! See server console for more info');
                console.log(err);
              })
          }
        })
      }
      else res.send('Cant post an empty comment!');
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book
        .findByIdAndDelete(bookid)
        .then(() => res.json('Delete successful'))
        .catch(err => {
          res.json('Error! Wrong ID');
          console.log(err);
        });
    });
  
};
