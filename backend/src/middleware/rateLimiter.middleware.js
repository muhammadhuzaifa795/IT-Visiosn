import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chatbot specific rate limiter (more restrictive)
export const chatbotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chatbot requests per minute
  message: {
    success: false,
    message: 'Too many chatbot requests, please wait a moment before sending another message.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiter (very restrictive)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});