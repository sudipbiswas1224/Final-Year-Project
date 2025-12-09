const OpenAI = require('openai');
const { createHash } = require('crypto');
const { sanitizeMessage } = require('../utils/helpers');
const logger = require('../utils/logger');
const { AI } = require('../config/constants');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  constructor() {
    this.cache = new Map(); // Replace with Redis in production
  }

  async generateResponse(message, context = {}) {
    try {
      const prompt = this.buildSystemPrompt(context);

      const completion = await openai.chat.completions.create({
        model: AI.MODEL,                         // ✅ now using gpt-3.5-turbo
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: message }
        ],
        temperature: AI.TEMPERATURE,
        max_tokens: AI.MAX_TOKENS
      });

      const reply = completion.choices[0].message.content;
      return {
        content: reply,
        timestamp: new Date().toISOString(),
        confidence: this.estimateConfidence(reply)
      };
    } catch (err) {
      logger.error('AI Service failed:', err);
      throw new Error('AI response generation failed');
    }
  }

  buildSystemPrompt(context) {
    return `You are a compassionate mental health assistant.
Respond empathetically, suggest coping strategies, and avoid giving medical advice.
${context.recentMessages ? `User has previously said: ${context.recentMessages.slice(-3).join(' ')}` : ''}`;
  }

  estimateConfidence(responseText) {
    const length = responseText.length;
    let confidence = 0.7;
    if (length > 100 && length < 500) confidence += 0.1;
    return Math.min(confidence, 1.0);
  }
}

module.exports = new AIService();
