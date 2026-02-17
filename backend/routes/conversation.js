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
router.post('/chat', async (req, res) => {
  try {
    const { userInput, character, characterName, conversationHistory } = req.body;

    const characterPrompts = {
      friend: `You are Alex, a friendly peer of the same age. Use casual, simple language. Be enthusiastic and encouraging. Keep responses to 1-2 short sentences.`,
      teacher: `You are Ms. Johnson, a kind and patient teacher. Be encouraging and educational. Use simple clear language. Keep responses to 1-2 short sentences.`,
      shopkeeper: `You are Mr. Lee, a helpful and friendly shopkeeper. Be polite and helpful. Keep responses to 1-2 short sentences.`
    };

    const prompt = characterPrompts[character] || characterPrompts.friend;

    // Use the same function as greeting module
    const result = await aiService.getGreetingResponse(userInput, conversationHistory, prompt);

    res.json({
      success: true,
      data: { aiResponse: result.aiResponse }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
