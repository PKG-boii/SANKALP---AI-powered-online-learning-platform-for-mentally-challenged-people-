const axios = require('axios');

class AIService {
  constructor() {
    this.service = process.env.AI_SERVICE || 'local'; // local, openai, anthropic
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llama2';
  }

  /**
   * Get AI response for greeting practice
   */
  async getGreetingResponse(userInput, conversationHistory = []) {
    const systemPrompt = `You are Alex, a friendly AI helping children with Down syndrome practice social skills. 
You're currently teaching greetings and introductions.

Guidelines:
- Use simple, clear language (5-7 word sentences max)
- Be encouraging and positive
- If child's response is appropriate, praise specifically
- If response needs improvement, gently guide
- Stay in character as a friendly peer
- Ask one question at a time
- Never use complex words or long sentences
- Be patient and supportive`;

    const aiResponse = await this.getCompletion(systemPrompt, userInput, conversationHistory);
    const feedback = this.analyzeGreeting(userInput);
    const score = this.calculateScore(userInput, feedback);

    return {
      aiResponse,
      feedback,
      score,
      encouragement: this.getEncouragement(score)
    };
  }

  /**
   * Get AI response for emotion recognition
   */
  async getEmotionFeedback(emotion, isCorrect, context = {}) {
    if (isCorrect) {
      return {
        feedback: `✓ Excellent! That's right - the person is ${emotion}!`,
        explanation: this.getEmotionExplanation(emotion),
        score: 10
      };
    } else {
      return {
        feedback: `Not quite. Let's look at the clues together.`,
        explanation: this.getEmotionExplanation(context.correctEmotion),
        score: 5
      };
    }
  }

  /**
   * Core AI completion method - supports multiple backends
   */
  async getCompletion(systemPrompt, userInput, conversationHistory = []) {
    try {
      const service = this.service.toLowerCase(); // Handle case sensitivity
      
      if (service === 'openai') {
        return await this.getOpenAICompletion(systemPrompt, userInput, conversationHistory);
      } else if (service === 'anthropic') {
        return await this.getAnthropicCompletion(systemPrompt, userInput, conversationHistory);
      } else if (service === 'gemini') {
        return await this.getGeminiCompletion(systemPrompt, userInput, conversationHistory);
      } else {
        // Default to local Ollama
        return await this.getOllamaCompletion(systemPrompt, userInput, conversationHistory);
      }
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.getFallbackResponse(userInput);
    }
  }

  /**
   * Ollama (Local) Integration - FREE
   */
  async getOllamaCompletion(systemPrompt, userInput, conversationHistory) {
    try {
      const prompt = `${systemPrompt}

Conversation so far:
${conversationHistory.map(msg => `${msg.role === 'user' ? 'Child' : 'Alex'}: ${msg.message}`).join('\n')}

Child: ${userInput}
Alex:`;

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 150
        }
      });

      return response.data.response.trim();
    } catch (error) {
      console.error('Ollama error:', error.message);
      throw new Error('Local AI service unavailable. Please check if Ollama is running.');
    }
  }

  /**
   * OpenAI Integration - PAID
   */
  async getOpenAICompletion(systemPrompt, userInput, conversationHistory) {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      { role: 'user', content: userInput }
    ];

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  }

  /**
   * Anthropic Claude Integration - PAID
   */
  async getAnthropicCompletion(systemPrompt, userInput, conversationHistory) {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert to Anthropic message format
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    messages.push({ role: 'user', content: userInput });

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      system: systemPrompt,
      messages: messages
    }, {
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    return response.data.content[0].text;
  }

  /**
   * Google Gemini Integration - PAID
   */
  /**
 * Google Gemini Integration - PAID
 */
async getGeminiCompletion(systemPrompt, userInput, conversationHistory) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Build the full prompt with system instructions
    const conversationText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.message}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

${conversationText ? conversationText + '\n' : ''}User: ${userInput}
AI:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
          topP: 0.9
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract text from response
    const text = response.data.candidates[0].content.parts[0].text;
    return text.trim();
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

  /**
   * Analyze greeting response
   */
  analyzeGreeting(text) {
    const feedback = [];
    const lowerText = text.toLowerCase();

    // Check for greeting words
    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      feedback.push("✓ Great greeting!");
    }

    // Check for name introduction
    if (lowerText.includes('my name') || lowerText.includes("i'm") || lowerText.includes('i am')) {
      feedback.push("✓ You introduced yourself!");
    }

    // Check for politeness
    if (lowerText.includes('please') || lowerText.includes('thank')) {
      feedback.push("✓ So polite!");
    }

    // Check for questions
    if (lowerText.includes('?') || lowerText.includes('how are') || lowerText.includes('what')) {
      feedback.push("✓ Nice question!");
    }

    // Check response length
    const wordCount = text.split(' ').length;
    if (wordCount < 3) {
      feedback.push("⚠ Try saying a bit more next time");
    } else if (wordCount > 15) {
      feedback.push("⚠ Try to keep it shorter and simpler");
    } else {
      feedback.push("✓ Good response length!");
    }

    if (feedback.filter(f => f.startsWith('✓')).length === 0) {
      feedback.push("💡 Try starting with 'Hi' or 'Hello'");
    }

    return feedback;
  }

  /**
   * Calculate score based on feedback
   */
  calculateScore(text, feedback) {
    const positives = feedback.filter(f => f.startsWith('✓')).length;
    const warnings = feedback.filter(f => f.startsWith('⚠')).length;
    
    let score = positives * 2.5; // Each positive worth 2.5 points
    score -= warnings * 1; // Each warning loses 1 point
    
    // Ensure score is between 0 and 10
    return Math.max(0, Math.min(10, Math.round(score)));
  }

  /**
   * Get encouragement based on score
   */
  getEncouragement(score) {
    if (score >= 9) return "Outstanding! You're a natural! 🌟";
    if (score >= 7) return "Excellent work! Keep it up! 👏";
    if (score >= 5) return "Good job! You're improving! 👍";
    return "Nice try! Let's practice more! 💪";
  }

  /**
   * Get emotion explanation
   */
  getEmotionExplanation(emotion) {
    const explanations = {
      happy: "👁 Eyes are smiling\n😊 Corners of mouth turn up\n✨ Face looks bright",
      sad: "👁 Eyes look down\n😔 Corners of mouth turn down\n😢 They might be crying",
      angry: "😠 Eyebrows pushed together\n👁 Eyes look intense\n😡 Mouth might be tight",
      scared: "👁 Eyes wide open\n😰 Eyebrows raised\n😨 Mouth might be open",
      surprised: "👁 Eyes very wide\n😮 Eyebrows raised high\n😲 Mouth open",
      confused: "🤔 Eyebrows tilted\n👁 Eyes searching\n😕 Head might be tilted"
    };

    return explanations[emotion.toLowerCase()] || "Look at the eyes, mouth, and eyebrows for clues!";
  }

  /**
   * Fallback response when AI is unavailable
   */
  getFallbackResponse(userInput) {
    const responses = [
      "That's great! Tell me more!",
      "Wonderful! You're doing so well!",
      "I like that! What else can you tell me?",
      "Nice! Keep practicing!",
      "Excellent! You're making great progress!"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

module.exports = new AIService();
