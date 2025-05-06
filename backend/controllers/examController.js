const Exam = require('../models/Exam');
const Result = require('../models/Result');
const User = require('../models/User');

let createExam = async (req, res) => {
  const { title, description } = req.body;

  try {
    const exam = new Exam({
      title,
      description,
      createdBy: req.user.userId
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

let getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

let addQuestion = async (req, res) => {
  const { examId } = req.params;
  const { text, options, correctAnswer } = req.body;

  console.log('Adding question to exam:', { examId, text, options, correctAnswer });

  try {
    if (!examId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid examId format:', examId);
      return res.status(400).json({ msg: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      console.error('Exam not found for ID:', examId);
      return res.status(404).json({ msg: 'Exam not found' });
    }

    if (!text || !options || !correctAnswer || !Array.isArray(options) || options.length !== 4) {
      console.error('Invalid question data:', { text, options, correctAnswer });
      return res.status(400).json({ msg: 'Invalid question data' });
    }

    const question = { text, options, correctAnswer };
    exam.questions.push(question);
    await exam.save();

    console.log('Question added successfully:', question);
    res.status(201).json(question);
  } catch (err) {
    console.error('Error adding question:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

let submit = async (req, res) => {
  const { examId } = req.params;
  const answers = req.body;

  console.log('Submitting exam:', { examId, answers, userId: req.user.userId });

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      console.error('Exam not found for ID:', examId);
      return res.status(404).json({ msg: 'Exam not found' });
    }

    let score = 0;
    const results = exam.questions.map((q, index) => {
      const isCorrect = q.correctAnswer === answers[index];
      if (isCorrect) score++;
      return { question: q.text, isCorrect };
    });

    const totalQuestions = exam.questions.length;

    const result = new Result({
      userId: req.user.userId,
      examId,
      score,
      totalQuestions,
      results
    });
    await result.save();
    console.log('Result saved:', result);

    res.json({ score, totalQuestions, results });
  } catch (err) {
    console.error('Error submitting exam:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

let getResults = async (req, res) => {
  console.log('Fetching results for user:', req.user.userId);

  try {
    const results = await Result.find({ userId: req.user.userId }).populate('examId', 'title');
    console.log('Results fetched:', results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

let getAllResults = async (req, res) => {
  console.log('Fetching all results for admin:', req.user.userId);
  console.log("from all results")
  try {
    
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      console.error('Unauthorized access attempt by user:', req.user.userId);
      return res.status(403).json({ msg: 'Unauthorized: Admin access required' });
    }

    const results = await Result.find()
      .populate('userId', 'username') 
      .populate('examId', 'title')
      .sort({ submittedAt: -1 });

    console.log('Populated results:', JSON.stringify(results, null, 2));

    results.forEach(result => {
      console.log(
        `Result for user: ${result.userId?.username || 'Unknown User'} (ID: ${result.userId?._id || 'N/A'}), ` +
        `Exam: ${result.examId?.title || 'N/A'}, Score: ${result.score}, ` +
        `Total Questions: ${result.totalQuestions || 'N/A'}, Correct Count: ${result.correctCount || 'N/A'}`
      );
    });
    console.log('All results fetched:', results.length, 'results');

    const studentsResults = {};
    results.forEach(result => {
      const studentId = result.userId?._id.toString() || 'unknown';
      if (!studentsResults[studentId]) {
        studentsResults[studentId] = {
          userId: result.userId?._id || null,
          username: result.userId?.username || 'Unknown User',
          exams: []
        };
      }
      studentsResults[studentId].exams.push({
        examId: result.examId?._id || null,
        examTitle: result.examId?.title || 'Unknown Exam',
        score: result.score,
        totalQuestions: result.totalQuestions || null,
        correctCount: result.correctCount || null,
        percentage: result.totalQuestions ? ((result.score / result.totalQuestions) * 100).toFixed(2) : null,
        submittedAt: result.submittedAt
      });
    });

    const formattedResults = Object.values(studentsResults);
    res.json(formattedResults);
  } catch (err) {
    console.error('Error fetching all results:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = {
  createExam,
  getExams,
  addQuestion,
  submit,
  getResults,
  getAllResults
};