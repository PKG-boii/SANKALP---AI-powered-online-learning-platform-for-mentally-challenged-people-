const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const db = require('../config/database');

// Greeting conversation endpoint
router.post('/greeting', async (req, res) => {
  try {
    const { childId, userInput, conversationHistory } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await aiService.getGreetingResponse(userInput, conversationHistory);

    // Save activity to database
    if (childId) {
      await db.saveActivity({
        childId,
        module: 'greetings',
        userInput,
        aiResponse: result.aiResponse,
        score: result.score,
        feedback: JSON.stringify(result.feedback)
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process conversation',
      error: error.message
    });
  }
});

// Emotion recognition endpoint
router.post('/emotion', async (req, res) => {
  try {
    const { childId, emotion, correctEmotion, isCorrect } = req.body;

    const result = await aiService.getEmotionFeedback(emotion, isCorrect, { correctEmotion });

    // Save activity
    if (childId) {
      await db.saveActivity({
        childId,
        module: 'emotions',
        userInput: emotion,
        aiResponse: result.feedback,
        score: result.score,
        feedback: JSON.stringify([result.explanation])
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Emotion recognition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process emotion',
      error: error.message
    });
  }
});

module.exports = router;
