const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 1,
    trim: true,
  },
  author: {
    type: String,
    minlength: 1,
    trim: true,
  },
  comments: [
    mongoose.Schema({
      text: {
        type: String,
        minlength: 1,
        trim: true,
      },
    })
  ],
  tags: [
    mongoose.Schema({
      name: {
        type: String,
        minlength: 1,
        trim: true,
      },
    })
  ],
  categories: [
    mongoose.Schema({
      name: {
        type: String,
        minlength: 1,
        trim: true,
      },
    })
  ],
});

QuestionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Question', QuestionSchema);
