import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeBlock from './CodeBlock';
import StreamingMessage from './StreamingMessage';



const MessageContent = ({
  content,
  isStreaming = false,
  onStreamComplete
}) => {
  // Check if content contains code blocks
  const hasCodeBlocks = content.includes('```');

  if (isStreaming && !hasCodeBlocks) {
    return (
      <StreamingMessage
        content={content}
        onComplete={onStreamComplete}
        speed={20}
      />
    );
  }

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : 'text';
          const codeContent = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return (
              <CodeBlock
                code={codeContent}
                language={language}
              />
            );
          }

          return (
            <code
              className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        p({ children }) {
          return <div className="mb-2 last:mb-0">{children}</div>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-4 mb-2">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-2">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MessageContent;