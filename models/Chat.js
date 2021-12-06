const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'public',
    },
    lastMessage: {
        /** set id last message */ type: Schema.Types.ObjectId,
        ref: 'Message',
    },
})

module.exports = mongoose.model('Chat', ChatSchema)
