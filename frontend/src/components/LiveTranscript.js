import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2 } from 'lucide-react';

const LiveTranscript = ({ transcript, isListening, isVisible }) => {
  if (!isVisible || (!transcript && !isListening)) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="glass rounded-2xl p-4 mb-4 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Mic className={`w-4 h-4 ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-300">
            {isListening ? 'Listening...' : 'Voice Input'}
          </span>
        </div>
        
        <div className="min-h-[40px] p-3 bg-black/20 rounded-lg border border-white/10">
          {transcript ? (
            <p className="text-white leading-relaxed">
              {transcript}
              {isListening && (
                <motion.span
                  className="inline-block w-2 h-5 bg-blue-400 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              {isListening ? 'Start speaking...' : 'Press the mic button to start voice input'}
            </p>
          )}
        </div>
        
        {transcript && (
          <motion.div
            className="mt-2 text-xs text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your transcript will be sent when you stop recording
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveTranscript;
