const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Пожалуйста, введите ваше полное имя.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Пожалуйста, введите ваш адрес электронной почты.'],
    },
});



module.exports = mongoose.model('User', UserSchema);
