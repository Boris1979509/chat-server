const chatService = require('../services/chat')
class ChatController{
    async show(req, res) {
        try {
            const { id } = req.params
            const chat = await chatService.getChat(id)
            res.status(200).send(chat)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    async showPublicChats(req, res){
        try {
            const chats = await chatService.getPublicChats()
            res.status(200).send(chats)
        } catch (error) {
            res.status(400).send(error)
        }
    }
}
module.exports = new ChatController()