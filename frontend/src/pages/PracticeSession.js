import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Bot, Mic } from 'lucide-react';
import axios from 'axios';

const PracticeSession = () => {
  const navigate = useNavigate();
  const { mode } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const modeConfig = {
    introduction: {
      title: 'Introduction Practice',
      color: 'from-blue-500 to-cyan-500',
      initialMessage: "Hi! I'm your AI communication coach. Let's practice your introduction skills. Start by introducing yourself as you would in a professional setting, and I'll provide feedback on your clarity, confidence, and delivery."
    },
    seminar: {
      title: 'Seminar Presentation',
      color: 'from-purple-500 to-pink-500',
      initialMessage: "Welcome to seminar presentation practice! I'll help you improve your public speaking skills. Begin by presenting a topic or sharing how you would start a presentation, and I'll give you constructive feedback."
    },
    interview: {
      title: 'Interview Preparation',
      color: 'from-teal-500 to-green-500',
      initialMessage: "Let's prepare you for your next interview! I'll help you practice common interview scenarios. Start by telling me about yourself as you would to an interviewer, and I'll provide feedback to help you shine."
    }
  };

  const currentMode = modeConfig[mode] || modeConfig.introduction;

  useEffect(() => {
    // Add initial AI message
    setMessages([{
      id: 1,
      type: 'ai',
      content: currentMode.initialMessage,
      timestamp: new Date()
    }]);
  }, [mode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/feedback', {
        message: inputText,
        mode: mode,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.feedback,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting feedback:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.div 
        className="glass border-b border-white/10 p-4 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/modes')}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${currentMode.color} bg-clip-text text-transparent`}>
                {currentMode.title}
              </h1>
              <p className="text-gray-400 text-sm">AI-powered communication coaching</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Mic className="w-5 h-5" />
            <span className="text-sm">Text Mode</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="h-full max-w-4xl mx-auto flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? `bg-gradient-to-r ${currentMode.color}` 
                        : 'bg-gray-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`rounded-2xl p-4 ${
                      message.type === 'user'
                        ? `bg-gradient-to-r ${currentMode.color} text-white`
                        : 'glass text-gray-100'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing your response...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div 
            className="p-4 border-t border-white/10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full glass rounded-2xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[60px] max-h-[120px]"
                  rows="2"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`p-4 rounded-2xl bg-gradient-to-r ${currentMode.color} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            <p className="text-gray-400 text-xs mt-2 text-center">
              Get personalized feedback on your clarity, confidence, and delivery
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PracticeSession;
