import { body, param, validationResult } from 'express-validator';
import { sanitizeInput, validateChatId as isValidChatId, validateUserId as isValidUserId } from '../lib/chatTitle.js';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Chat input validation
export const validateChatInput = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!isValidUserId(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    }),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .customSanitizer((value) => sanitizeInput(value)),
  handleValidationErrors,
];

// Chat ID validation
export const validateChatIdMiddleware = [
  param('chatId')
    .notEmpty()
    .withMessage('Chat ID is required')
    .custom((value) => {
      if (!isValidChatId(value)) {
        throw new Error('Invalid chat ID format');
      }
      return true;
    }),
  handleValidationErrors,
];

// User ID validation
export const validateUserIdMiddleware = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!isValidUserId(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    }),
  handleValidationErrors,
];

// Chat title validation
export const validateChatTitle = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .customSanitizer((value) => sanitizeInput(value)),
  handleValidationErrors,
];

// Pagination validation
export const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];