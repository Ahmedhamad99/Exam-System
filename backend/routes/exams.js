
const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/auth');

const examFunc = require('../controllers/examController');


router.get('/', protect, examFunc.getExams);

router.post('/:examId/submit', protect, examFunc.submit);
router.get('/all-results', protect, examFunc.getAllResults); 

router.post('/', protect, examFunc.createExam);
router.post('/:examId/questions', protect, examFunc.addQuestion);
router.get('/results', protect, examFunc.getResults);


module.exports = router;
