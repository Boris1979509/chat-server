const userService = require('../services/user')
class UserController {
    async create(req, res) {
        try {
            const newUser = {
                email: req.locals.email,
                ...req.body,
            }
            const user = await userService.createUser(newUser)
            res.status(200).send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    async show(req, res) {
        try {
            const { email } = req.params
            const user = await userService.getUser(email)
            res.status(200).send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    async getUsersChat(req, res) {
        try {
            const { id } = req.params
            const users = await userService.getUsersChat(id)
            res.status(200).send(users)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    async userLeaveChat(req, res) {
        try {
            const { email, id } = req.params
            const response = await userService.userLeaveChat(email, id)
            res.status(200).send({ success: response })
        } catch (error) {
            res.status(400).send(error)
        }
    }
}
module.exports = new UserController()
