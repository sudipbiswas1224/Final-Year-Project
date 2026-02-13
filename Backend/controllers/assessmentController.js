const AssessmentTestTemplate = require('../models/AssessmentTestTemplate');
const AssessmentResult = require('../models/AssessmentResult');
const scoring = require('../services/scoring');

// List all available test types
exports.listTests = async (req, res) => {
  try {
    const tests = await AssessmentTestTemplate.find({}, 'name');
    res.json(tests.map((test => test.name)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list tests' });
  }
};

// Get a specific test template by type
exports.getTestTemplate = async (req, res) => {
  try {
    const { type } = req.params;
    const test = await AssessmentTestTemplate.findOne({ name: type });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test template' });
  }
};

// Submit assessment and score it
exports.submitAssessment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testType, responses, phase } = req.body;
    const test = await AssessmentTestTemplate.findOne({ name: testType });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (!Array.isArray(responses) || responses.length !== test.questions.length) {
      return res.status(400).json({ error: 'Invalid responses' });
    }
    // Score using modular logic
    const scorer = scoring[test.scoringLogic];
    if (!scorer) return res.status(500).json({ error: 'Scoring logic not found' });
    const { totalScore, interpretation, feedback } = scorer(responses);
    const result = await AssessmentResult.create({
      userId,
      testType,
      responses,
      totalScore,
      interpretation,
      phase,
      feedback
    });
    res.status(201).json({
      totalScore,
      interpretation,
      feedback,
      resultId: result._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Assessment submission failed' });
  }
};

// Get all past test attempts for a user
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await AssessmentResult.find({ userId }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Get progress in a specific test type for a user
exports.getProgress = async (req, res) => {
  try {
    const { userId, testType } = req.params;
    const results = await AssessmentResult.find({ userId, testType }).sort({ date: 1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
