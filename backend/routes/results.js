
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

router.post('/:examId', auth, async (req, res) => {
  const { answers } = req.body; 
  try {
    const exam = await Exam.findById(req.examId).populate('questions');
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    let score = 0;
    const total = exam.questions.length;

    for (const question of exam.questions) {
      if (answers[question._id] === question.correctAnswer) {
        score++;
      }
    }

    const result = { userId: req.user.userId, examId: req.params.examId, score, total };
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
