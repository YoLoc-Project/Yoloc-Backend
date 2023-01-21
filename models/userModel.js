const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
    email : String,
    password : String,
    name: { type: String, default: 'Name Surname' },
    role : { 
        type: String, 
        enum : ['user','admin'],
        default: 'user' 
    },
    nickname: { type: String, default: 'Undefined' },
    phone : { type: String, default: '' },
    gender : {
        type: String,
        enum : ['male','female'],
        default: 'male'
    },
    faceImgs : [
        {
            type: mongoose.Schema.Types.String,
        }
    ],
    token : String,
})

newSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model('User', newSchema);