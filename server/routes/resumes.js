const express = require('express');

const Resume = require('../models/resume');
const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');
const { HeadHunterParser } = require('../utils/parse');

const router = express.Router();

router.post('/create', authenticate, csrfCheck, async (req, res) => {
  try {
    const { body } = req;
    const resume = new Resume(body);
    const persistedResume = await resume.save();

    res
      .status(201)
      .json({
        title: 'Resume created successful',
        detail: 'Successfully created new resume',
        resume: persistedResume
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Resume creating Error',
          detail: 'Something went wrong during resume creating process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.get('/:id', authenticate, csrfCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById({ _id: id });

    res.json({
      resume,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Resume getting Error',
          detail: 'Something went wrong during resume getting process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.get('/parse/hh/:id', authenticate, csrfCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const parser = new HeadHunterParser('resume', id);
    const parsedResume = await parser.getResume();

    let persistedResume = await Resume.findOneAndUpdate({ id }, {
      '$set': parsedResume
    }, { upsert: true, new: true });

    res.json({
      resume: persistedResume,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Resume getting Error',
          detail: 'Something went wrong during resume getting process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

module.exports = router;
