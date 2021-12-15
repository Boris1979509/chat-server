const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const users = require('./users')()

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

const io = require('socket.io')(server, {
    cors: {
        origin: [
            'https://boris1979509.github.io/chat-client',
            'http://192.168.0.6:8080',
        ],
        methods: ['GET', 'POST'],
    },
})

const mongoose = require('mongoose')
const { url } = require('./config/db')

/** Sockets */
const SocketListeners = require('./socket/listeners')
const SocketEmitters = require('./socket/emitters')

/** Services */
const chatService = require('./services/chat')
const messageService = require('./services/message')
const userService = require('./services/user')

app.use(cors()) /** *CORS */

/** Routes API */
const ROUTES = {
    users: '/api/users',
    chats: '/api/chats',
    messages: '/api/messages',
}

/** Routes */
const userRoute = require('./routes/user')
const chatRoute = require('./routes/chat')
const messageRoute = require('./routes/message')

app.use(express.json())
app.use(ROUTES.users, userRoute)
app.use(ROUTES.chats, chatRoute)
app.use(ROUTES.messages, messageRoute)

/** Create public chat when init App */
const initApp = async () => {
    try {
        const globalChat = await chatService.isGlobalChatExist()
        if (globalChat) return Promise.resolve()
        await chatService.createChat({ name: chatService.GLOBAL_CHAT_NAME })
    } catch (error) {
        return Promise.reject(error)
    }
}

/**Connect MongoDb */
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Mongo connected success.')
    })
    .then(initApp)
    .then(() => console.log('Chat is up!'))
    .catch((err) => {
        console.log(err)
    })

io.on('connection', (socket) => {
    const u = (id, name, socket, chats) => ({ id, name, socket, chats })

    //socket.emit(SocketEmitters.SET_USER_ONLINE)

    /** SET USER WITH CHATS */
    socket.on(
        SocketListeners.SET_USER_ONLINE,
        ({ _id: userId, username, chats }) => {
            users.add(u(userId, username, socket.id, chats))
            chats.forEach((chat) => {
                socket.join(chat)
                io.to(chat).emit(SocketEmitters.USER_ONLINE, {
                    userId,
                    username,
                })
            })
            console.log('connect: ' + username)
        }
    )
    /** FETCH SOCKETS COUNT */
    socket.on(
        SocketListeners.FETCH_COUNT_SOCKETS_IN_ROOM,
        async ({ chatId, state }) => {
            const ids = users.getByRoomIds(chatId)
            /** Count sockets in room */
            const sockets = await io.in(chatId).fetchSockets()
            const data = {
                chatId,
                count: sockets.length,
                ids,
            }
            /**
             *  If (state === true) { emit all sockets } else { emit current socket }
             */
            if (state) io.emit(SocketEmitters.FETCH_COUNT_SOCKETS_IN_ROOM, data)
            else socket.emit(SocketEmitters.FETCH_COUNT_SOCKETS_IN_ROOM, data)
        }
    )

    /** User offline */
    socket.on('disconnect', () => {
        if (!users.get(socket.id)) return
        const { id: userId, name: username, chats } = users.remove(socket.id)
        chats.forEach((chat) => {
            io.in(chat).emit(SocketEmitters.USER_OFFLINE, { userId, username })
        })

        socket.disconnect() // DISCONNECT SOCKET
        console.log('disconnect: ' + username)
    })
    /** Join chat */
    socket.on(
        SocketListeners.JOIN_CHAT,
        async ({ chatId, userId, username }) => {
            try {
                await userService.userJoinChat(chatId, userId)
                socket.join(chatId)
                users.add(u(userId, username, socket.id, [chatId]))
                /** For chat room */
                io.in(chatId).emit(SocketEmitters.NEW_USER_JOIN, {
                    userId,
                    username,
                    chatId,
                })
                const ids = users.getByRoomIds(chatId)
                /** Count sockets in room, send all sockets */
                const sockets = await io.in(chatId).fetchSockets()
                io.emit(SocketEmitters.FETCH_COUNT_SOCKETS_IN_ROOM, {
                    chatId,
                    count: sockets.length,
                    ids,
                })
            } catch (error) {
                console.log(error)
            }
        }
    )
    /** Leave chat */
    socket.on(
        SocketListeners.LEAVE_CHAT,
        async ({ chatId, userId, username }) => {
            try {
                const { chats = [] } = await userService.userLeaveChat(
                    userId,
                    chatId
                )

                socket.leave(chatId) /** User leave chat */
                users.add(u(userId, username, socket.id, chats))

                /** For chat room */
                io.in(chatId).emit(SocketEmitters.USER_LEAVE_CHAT, {
                    chatId,
                    username,
                })
                const ids = users.getByRoomIds(chatId)
                /** Count sockets in room, send all sockets */
                const sockets = await io.in(chatId).fetchSockets()
                io.emit(SocketEmitters.FETCH_COUNT_SOCKETS_IN_ROOM, {
                    chatId,
                    count: sockets.length,
                    ids,
                })
                /** For current socket */
                socket.emit(SocketEmitters.USER_REFRESH_AFTER_LEAVE_CHAT)
            } catch (error) {
                console.log(error)
            }
        }
    )

    // User typing
    socket.on(SocketListeners.USER_TYPING, ({ chatId, userId, username }) => {
        io.in(chatId).emit(SocketEmitters.USER_TYPING, {
            chatId,
            userId,
            username,
        })
    })
    // New message
    socket.on(SocketListeners.NEW_MESSAGE, async ({ chatId, userId, text }) => {
        try {
            const message = await messageService.newMessage({
                chat: chatId,
                user: userId,
                text,
            })
            await chatService.setLastMessage(chatId, message._id)
            io.in(chatId).emit(SocketEmitters.NEW_MESSAGE, message)
        } catch (error) {
            console.log(error)
        }
    })
})

server.listen(PORT, async () => {
    console.log('listening on : ' + PORT)
})
