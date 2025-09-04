import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Presentation, Briefcase, ArrowLeft } from 'lucide-react';

const ModeSelection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const modes = [
    {
      id: 'introduction',
      title: 'Introduction Practice',
      description: 'Perfect your self-introductions for networking, meetings, and social situations',
      icon: <User className="w-12 h-12" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'seminar',
      title: 'Seminar Presentation',
      description: 'Enhance your presentation skills for seminars, workshops, and public speaking',
      icon: <Presentation className="w-12 h-12" />,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      description: 'Ace your interviews with confident responses and professional communication',
      icon: <Briefcase className="w-12 h-12" />,
      gradient: 'from-teal-500 to-green-500',
      bgGradient: 'from-teal-500/20 to-green-500/20'
    }
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={cardVariants}>
          <motion.button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.button>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Choose Your Practice Mode
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the type of communication you'd like to practice and improve with AI-powered feedback
          </p>
        </motion.div>

        {/* Mode Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-8"
          variants={containerVariants}
        >
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              className="group cursor-pointer"
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/practice/${mode.id}`)}
            >
              <div className={`glass rounded-3xl p-8 h-full bg-gradient-to-br ${mode.bgGradient} border-2 border-transparent group-hover:border-white/20 transition-all duration-300`}>
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${mode.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {mode.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {mode.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  {mode.description}
                </p>
                
                {/* Call to action */}
                <div className="flex items-center text-blue-400 font-semibold group-hover:text-white transition-colors">
                  Start Practicing
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Info */}
        <motion.div 
          className="text-center"
          variants={cardVariants}
        >
          <p className="text-gray-400 text-sm">
            Each session provides personalized feedback on clarity, confidence, and delivery
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModeSelection;
