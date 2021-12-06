const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: { type: String, required: true },

        chats: [
            /** ref on Chat _id */
            {
                type: Schema.Types.ObjectId,
                ref: 'Chat',
            },
        ],
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
