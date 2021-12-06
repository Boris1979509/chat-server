const User = require('../models/User')
const chatService = require('./chat')

/** Find user by email  */
const getUser = async (email) => {
    try {
        return await User.findOne({ email })
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Create or update user */
const createUser = async (data) => {
    try {
        await User.updateOne({ email: data.email }, data, {
            upsert: true,
        })
        return getUser(data.email)
    } catch (error) {
        return Promise.reject(error)
    }
}

const userJoinChat = async (chatId, userId) => {
    try {
        await User.updateOne(
            { _id: userId, chats: { $nin: chatId } },
            { $push: { chats: chatId } }
        )
        await chatService.addUserToChat(chatId, userId)
        return true
    } catch (error) {
        return Promise.reject(error)
    }
}
/** Find all users by chatId  */
const getUsersChat = async (chatId) => {
    try {
        return await User.find({ chats: { _id: chatId } })
    } catch (error) {
        return Promise.reject(error)
    }
}
/** User leave current chat */
const userLeaveChat = async (userId, chatId) => {
    try {
        await chatService.removeUserFromChat(chatId, userId)
        return await User.findByIdAndUpdate(
            { _id: userId },
            { $pullAll: { chats: [chatId] } },
            { new: true }
        )
    } catch (error) {
        return Promise.reject(error)
    }
}
module.exports = {
    createUser,
    getUser,
    userJoinChat,
    getUsersChat,
    userLeaveChat,
}
