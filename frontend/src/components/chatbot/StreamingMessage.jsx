import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';



const StreamingMessage= ({
  content,
  onComplete,
  speed = 30
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!content) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="whitespace-pre-wrap">{displayedContent}</div>
      {!isComplete && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-blue-500 ml-1"
        />
      )}
    </motion.div>
  );
};

export default StreamingMessage;