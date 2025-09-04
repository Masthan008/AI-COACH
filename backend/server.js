const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Communication Coach API is running',
    timestamp: new Date().toISOString()
  });
});

// AI Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { message, mode, conversationHistory } = req.body;

    if (!message || !mode) {
      return res.status(400).json({ 
        error: 'Message and mode are required' 
      });
    }

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenRouter API key not configured' 
      });
    }

    // Create context-aware prompt based on mode
    const modePrompts = {
      introduction: "You are an expert communication coach specializing in professional introductions. Analyze the user's introduction and provide brief, constructive feedback (2-3 sentences) focusing on clarity, confidence, and professionalism. Be encouraging but specific about improvements.",
      seminar: "You are an expert presentation coach. Analyze the user's seminar content and provide brief, constructive feedback (2-3 sentences) focusing on clarity, engagement, and delivery. Be encouraging but specific about improvements.",
      interview: "You are an expert interview coach. Analyze the user's response and provide brief, constructive feedback (2-3 sentences) focusing on clarity, confidence, and how well they answer the question. Be encouraging but specific about improvements."
    };

    const systemPrompt = modePrompts[mode] || modePrompts.introduction;

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-3) // Last 3 messages for context
        .map(msg => `${msg.type === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
        .join('\n');
    }

    // Prepare the prompt
    const prompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}Current user message: "${message}"

Provide specific, actionable feedback that helps improve their communication skills. Keep it concise and motivating.`;

    // Make request to OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek/deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Communication Coach'
      }
    });

    const feedback = response.data.choices[0].message.content.trim();

    res.json({ 
      feedback,
      mode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating feedback:', error.response?.data || error.message);
    
    // Provide fallback response
    const fallbackResponses = {
      introduction: "Great start! Focus on speaking clearly and confidently. Try to highlight your key strengths and what makes you unique. Practice maintaining eye contact and a warm, professional tone.",
      seminar: "Good presentation! Work on engaging your audience with clear, structured points. Consider adding more specific examples to illustrate your ideas. Remember to pace yourself and use pauses effectively.",
      interview: "Nice response! Be more specific with examples that demonstrate your skills. Show enthusiasm for the role and company. Practice answering with the STAR method (Situation, Task, Action, Result)."
    };

    const fallbackFeedback = fallbackResponses[req.body.mode] || fallbackResponses.introduction;

    res.json({ 
      feedback: fallbackFeedback,
      mode: req.body.mode,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Communication Coach API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 OpenRouter API: ${process.env.OPENROUTER_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});
