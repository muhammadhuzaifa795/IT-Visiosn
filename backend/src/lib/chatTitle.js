export const generateChatTitle = (message) => {
  if (!message || typeof message !== 'string') {
    return 'New Chat';
  }

  const cleaned = message.trim().replace(/\s+/g, ' ');
  
  if (cleaned.length <= 50) {
    return cleaned;
  }
  
  const truncated = cleaned.substring(0, 50);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 20) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

export const detectCodeLanguage = (code) => {
  if (!code || typeof code !== 'string') {
    return 'text';
  }

  const lowerCode = code.toLowerCase();
  
  if (lowerCode.includes('function') || lowerCode.includes('const') || 
      lowerCode.includes('let') || lowerCode.includes('var') ||
      lowerCode.includes('=>') || lowerCode.includes('console.log')) {
    return 'javascript';
  }
  
  if (lowerCode.includes('def ') || lowerCode.includes('import ') ||
      lowerCode.includes('print(') || lowerCode.includes('if __name__')) {
    return 'python';
  }
  
  if (lowerCode.includes('<html>') || lowerCode.includes('<div>') ||
      lowerCode.includes('<!doctype') || lowerCode.includes('<body>')) {
    return 'html';
  }
  
  if (lowerCode.includes('{') && lowerCode.includes('}') &&
      (lowerCode.includes('color:') || lowerCode.includes('margin:') ||
       lowerCode.includes('padding:') || lowerCode.includes('display:'))) {
    return 'css';
  }
  
  if (lowerCode.includes('public class') || lowerCode.includes('system.out') ||
      lowerCode.includes('public static void main')) {
    return 'java';
  }
  
  if (lowerCode.includes('#include') || lowerCode.includes('int main') ||
      lowerCode.includes('printf(') || lowerCode.includes('cout <<')) {
    return 'cpp';
  }
  
  if (lowerCode.includes('select ') || lowerCode.includes('insert ') ||
      lowerCode.includes('update ') || lowerCode.includes('delete ') ||
      lowerCode.includes('create table')) {
    return 'sql';
  }
  
  if ((lowerCode.startsWith('{') && lowerCode.endsWith('}')) ||
      (lowerCode.startsWith('[') && lowerCode.endsWith(']'))) {
    try {
      JSON.parse(code);
      return 'json';
    } catch (e) {
      // Not valid JSON
    }
  }
  
  return 'text';
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) {
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const validateChatId = (chatId) => {
  if (!chatId || typeof chatId !== 'string') {
    return false;
  }
  
  return /^[0-9a-fA-F]{24}$/.test(chatId);
};

export const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  return /^[0-9a-fA-F]{24}$/.test(userId);
};