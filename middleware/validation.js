const { body, param } = require('express-validator');

exports.validateChatMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message is too long'),

  body('conversationId')
    .optional()
    .isMongoId().withMessage('Invalid conversation ID')
];

exports.validateUserRegistration = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password too short'),
  body('displayName').notEmpty().withMessage('Display name required')
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.validateConversationId = [
  param('conversationId').isMongoId().withMessage('Invalid conversation ID')
];
