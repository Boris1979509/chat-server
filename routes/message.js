const express = require('express')
const router = express.Router()
const authMiddleware  = require('../middleware/authMiddleware')
const MessageController = require('../controllers/MessageController') 
/**
 * @route /api/messages/chat/:id
 * @private
 */
router.get('/chat/:id', authMiddleware, MessageController.show)

module.exports = router
