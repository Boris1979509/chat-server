const messageService = require('../services/message')
class MessageController {
    async show(req, res){
        try {
            const { id } = req.params
            const messages = await messageService.getChatMessages(id)
            res.status(200).send(messages)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
module.exports = new MessageController()