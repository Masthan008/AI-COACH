import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Practice Speaking",
      description: "Improve your verbal communication with AI-powered feedback"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Real-time Feedback",
      description: "Get instant, constructive feedback on your communication style"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiple Scenarios",
      description: "Practice introductions, seminars, and interview situations"
    }
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Hero Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            AI Communication Coach
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-8 font-light"
            variants={itemVariants}
          >
            Practice. Improve. Speak with Confidence.
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Master the art of communication with personalized AI feedback. Whether you're preparing for interviews, 
            presentations, or social interactions, our AI coach helps you build confidence and clarity.
          </motion.p>
          
          <motion.button
            onClick={() => navigate('/modes')}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 mx-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Practicing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={itemVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-8 hover-lift"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="glass rounded-2xl p-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of users who have improved their speaking skills with AI-powered coaching.
          </p>
          <motion.button
            onClick={() => navigate('/modes')}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
