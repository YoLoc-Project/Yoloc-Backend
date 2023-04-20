const secretKey = process.env.SECRET_KEYWORD;
const mongoUrl = process.env.MONGODB_URL;
const serverPort = process.env.PORT || 3000;

module.exports = {
    secretKey: secretKey,
    mongoUrl: mongoUrl,
    serverPort: serverPort,
}