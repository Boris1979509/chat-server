module.exports = {
    type: 'service_account',
    project_id: 'chat-app-cfaa8',
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email:
        'firebase-adminsdk-zeefi@chat-app-cfaa8.iam.gserviceaccount.com',
    client_id: '113971831742200178050',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zeefi%40chat-app-cfaa8.iam.gserviceaccount.com',
}
