import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { CopyIcon, CheckIcon } from 'lucide-react';


const CodeBlock = ({ 
  code, 
  language = 'javascript',
  theme = 'vs-dark'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gray-900 rounded-lg overflow-hidden my-4"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="h-64">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            folding: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </motion.div>
  );
};

export default CodeBlock;