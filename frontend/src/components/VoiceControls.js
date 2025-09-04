import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceControls = ({ 
  isListening, 
  onStartListening, 
  onStopListening, 
  isSpeaking, 
  onStopSpeaking,
  isVoiceSupported,
  isTTSSupported 
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Voice Input Control */}
      {isVoiceSupported && (
        <motion.button
          onClick={isListening ? onStopListening : onStartListening}
          className={`p-3 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </motion.button>
      )}

      {/* Voice Output Control */}
      {isTTSSupported && (
        <motion.button
          onClick={onStopSpeaking}
          disabled={!isSpeaking}
          className={`p-3 rounded-full transition-all duration-200 ${
            isSpeaking 
              ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={isSpeaking ? { scale: 1.05 } : {}}
          whileTap={isSpeaking ? { scale: 0.95 } : {}}
          title={isSpeaking ? 'Stop AI voice' : 'AI voice inactive'}
        >
          {isSpeaking ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default VoiceControls;
