const Chat = require('../models/Chat')
const GLOBAL_CHAT_NAME = 'global'
const CHAT_TYPES = {
    public: 'public',
}
const isGlobalChatExist = async () => {
    try {
        return await Chat.findOne({ name: GLOBAL_CHAT_NAME })
    } catch (error) {
        return Promise.reject(error)
    }
}
const createChat = async (data) => {
    try {
        return await Chat.create(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
const getChat = async (id) => {
    try {
        return await Chat.findById(id).populate('users')
    } catch (error) {
        return Promise.reject(error)
    }
}
const getPublicChats = async () => {
    try {
        return await Chat.find({ type: CHAT_TYPES.public }).populate({
            path: 'lastMessage',
            model: 'Message',
            populate: { path: 'user', select: 'username' },
        })
    } catch (error) {
        return Promise.reject(error)
    }
}

const setLastMessage = async (chatId, messageId) => {
    try {
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: messageId,
        })
        return true
    } catch (error) {
        return Promise.reject(error)
    }
}
/** Add user to current chat */
const addUserToChat = async (chatId, userId) => {
    try {
        await Chat.updateOne({ _id: chatId }, { $push: { users: userId } })
        return true
    } catch (error) {
        return Promise.reject(error)
    }
}
/** Remove user from current chat */
const removeUserFromChat = async (chatId, userId) => {
    try {
        await Chat.updateOne({ _id: chatId }, { $pullAll: { users: [userId] } })
        return true
    } catch (error) {
        return Promise.reject(error)
    }
}
module.exports = {
    GLOBAL_CHAT_NAME,
    isGlobalChatExist,
    createChat,
    getChat,
    getPublicChats,
    setLastMessage,
    addUserToChat,
    removeUserFromChat,
}
