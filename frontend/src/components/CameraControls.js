import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Eye, Smile, Target } from 'lucide-react';

const CameraControls = ({ 
  isActive, 
  onStart, 
  onStop, 
  isSupported, 
  analysisData,
  confidenceMessage 
}) => {
  const { eyeContact, smile, headStability, confidence } = analysisData;

  return (
    <div className="flex flex-col gap-4">
      {/* Camera Toggle */}
      <div className="flex items-center gap-2">
        {isSupported && (
          <motion.button
            onClick={isActive ? onStop : onStart}
            className={`p-3 rounded-full transition-all duration-200 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isActive ? 'Stop camera analysis' : 'Start camera analysis'}
          >
            {isActive ? (
              <CameraOff className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </motion.button>
        )}
        
        <span className="text-sm text-gray-400">
          {isActive ? 'Camera Active' : 'Camera Off'}
        </span>
      </div>

      {/* Analysis Panel */}
      {isActive && (
        <motion.div
          className="glass rounded-2xl p-4 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-white font-semibold text-sm mb-3">Live Analysis</h4>
          
          {/* Confidence Score */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Confidence</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    confidence >= 70 ? 'bg-green-500' : 
                    confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-white font-mono">{confidence}%</span>
          </div>

          {/* Eye Contact */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-300">Eye Contact</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${eyeContact}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-white font-mono">{eyeContact}%</span>
          </div>

          {/* Smile */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Smile className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Positivity</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${smile}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-white font-mono">{smile}%</span>
          </div>

          {/* Head Stability */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Stability</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${headStability}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-white font-mono">{headStability}%</span>
          </div>

          {/* Confidence Message */}
          <motion.div
            className="mt-3 p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10"
            key={confidenceMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-white text-center">{confidenceMessage}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CameraControls;
