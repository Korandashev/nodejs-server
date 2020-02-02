const express = require('express');

const Question = require('../models/question');
const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');

const router = express.Router();

router.post('/create', authenticate, csrfCheck, async (req, res) => {
  try {
    const { body } = req;
    const question = new Question(body);
    const persistedQuestion = await question.save();

    res
      .status(201)
      .json({
        title: 'Question created successful',
        detail: 'Successfully created new question',
        question: persistedQuestion
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Question creating Error',
          detail: 'Something went wrong during question creating process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.get('/:id', authenticate, csrfCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById({ _id: id });

    res.json({
      question,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Question getting Error',
          detail: 'Something went wrong during question getting process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

module.exports = router;
