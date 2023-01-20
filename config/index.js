const secretKey = process.env.SECRET_KEYWORD;
const serverPort = process.env.PORT || 3000;

module.exports = {
    secretKey: secretKey,
    serverPort: serverPort
}