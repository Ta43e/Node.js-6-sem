const jwt =  require('jsonwebtoken');
const UserModel = require('../model/user.js');
var ACCESS_TOKEN_SECRET='ACCESS_TOKEN_SECRET'
var REFRESH_TOKEN_SECRET='REFRESH_TOKEN_SECRET'
const TokenVerifyingMiddleware = async (
    req,
    res,
    next
) => {

    try {
        const {accessToken} = req.cookies;
        if (!accessToken) {
           return res.redirect("/login")
        }
        const {id} = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const checkUser = await UserModel.findById(id); 
        req.user = checkUser;
        console.log(checkUser);
        if (!req.user) {
            res.status(401).json({message: fff})
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    TokenVerifyingMiddleware
}