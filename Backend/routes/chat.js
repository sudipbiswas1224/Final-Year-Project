const express = require('express');
const {authenticate} = require('../middleware/auth');
const { getChatHistory } = require('../controllers/chatController');

const chatRouter = express.Router();


chatRouter.get('/', authenticate, getChatHistory);

module.exports = chatRouter;