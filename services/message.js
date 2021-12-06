const Message = require('../models/Message')

const getChatMessages = async (chatId) => {
    try {
        return await Message.find({ chat: chatId }).populate('user', [
            'username',
        ])
    } catch (error) {
        return Promise.reject(error)
    }
}
const newMessage = async ({ chat, user, text }) => {
    try {
        const newMessage = {
            chat,
            user,
            text,
            time: Date.now(),
        }
        const message = await Message.create(newMessage)
        return await Message.findById(message._id).populate('user', [
            'username',
        ])
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = {
    newMessage,
    getChatMessages,
}
