class Users {
    /**
     * Users
     */
    constructor() {
        this.users = []
    }

    /**
     * Add user
     * @param {Object} user
     */
    add(user) {
        if (!user.chats.length) return
        const id = user.id
        const idx = this.users.findIndex((user) => user.id === id)
        if (idx !== -1) {
            this.users.splice(idx, 1)
        }
        this.users.push(user)
    }

    /**
     * get user by socket
     * @param {string} socket
     * @returns {boolean}
     */
    get(socket) {
        return this.users.some((user) => user.socket === socket)
    }

    /**
     * Remove user by socket
     * @param {string} socket
     * @returns {Object}
     */

    remove(socket) {
        //const user = this.get(id)
        const user = this.users.find((user) => user.socket === socket)
        if (user) {
            this.users = this.users.filter((user) => user.socket !== socket)
        }
        return user
    }

    /**
     * Get users in room
     * @param {string} room
     * @returns {Object[]}
     */
    getByRoom(room) {
        return this.users.filter((user) => user.chats.includes(room))
    }

    /**
     *
     * @param {string} room
     * @returns {number}
     */
    getCount(room) {
        return this.getByRoom(room).length
    }

    /**
     * Get users ids
     * @param {string} room
     * @returns {Object[]}
     */
    getByRoomIds(room) {
        return this.getByRoom(room).map((item) => item.id)
    }

    /**
     * Get all users
     * @returns {Object[]}
     */
    getUsers() {
        return this.users
    }
}
module.exports = () => {
    return new Users()
}
