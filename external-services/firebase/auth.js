const admin = require('../../external-services/firebase/admin')

/** User verify id token */
const verifyToken = async (idToken) => {
    try {
        return await admin.auth().verifyIdToken(idToken)
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = {
    verifyToken,
}
