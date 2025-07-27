export const generateChatTitle = (message) => {
  // Remove extra whitespace and limit to first 50 characters
  const cleaned = message.trim().replace(/\s+/g, ' ');
  
  // If message is short, use it as is
  if (cleaned.length <= 50) {
    return cleaned;
  }
  
  // Find the last complete word within 50 characters
  const truncated = cleaned.substring(0, 50);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 20) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

export const detectCodeLanguage = (code) => {
  // Simple language detection based on common patterns
  if (code.includes('function') || code.includes('const') || code.includes('let')) {
    return 'javascript';
  }
  if (code.includes('def ') || code.includes('import ')) {
    return 'python';
  }
  if (code.includes('<html>') || code.includes('<div>')) {
    return 'html';
  }
  if (code.includes('public class') || code.includes('System.out')) {
    return 'java';
  }
  if (code.includes('#include') || code.includes('int main')) {
    return 'cpp';
  }
  return 'text';
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};