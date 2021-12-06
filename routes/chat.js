const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const ChatController = require('../controllers/ChatController')
/**
 * @route /api/chats/public
 * @private
 */
router.get('/public', authMiddleware, ChatController.showPublicChats)

/**
 * @route /api/chats/:id
 * @private
 */
router.get('/:id', authMiddleware, ChatController.show)

module.exports = router
