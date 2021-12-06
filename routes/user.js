const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const UserController = require('../controllers/UserController')

/**
 * @route /api/users
 * @private
 */
router.post('/', authMiddleware, UserController.create)
/**
 * @route /api/users/:email
 * @private
 */
router.get('/:email', authMiddleware, UserController.show)

/**
 * @route /api/users/chats/:id
 * @private
 */
router.get('/chats/:id', authMiddleware, UserController.getUsersChat)

/**
 * @route /api/users/:email/chats/:id
 * @private
 */
router.delete('/:email/chats/:id', authMiddleware, UserController.userLeaveChat)

module.exports = router
