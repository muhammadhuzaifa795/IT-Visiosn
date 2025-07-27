import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-20">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">AI is typing</span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;