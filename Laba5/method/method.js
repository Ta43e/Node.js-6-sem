const user = require("../users.json") || [];

function checkUser(name, password){
    return user.some(user => user.name === name && user.password === password);
}


function getUser(name){
    return user.find(user => user.name === name);
}

module.exports = {
    checkUser: checkUser,
    getUser: getUser,
}