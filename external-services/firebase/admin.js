const admin = require('firebase-admin')
const serviceAccount  = require('../../config/admin-config.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
module.exports = admin
