const jwt =  require('jsonwebtoken');
const UserModel = require('../model/user.js');
const redisClient  = require('../redis/Client.js');
const { TokenVerifyingMiddleware } = require("../midlewares/index.js");
var ACCESS_TOKEN_SECRET='ACCESS_TOKEN_SECRET'
var REFRESH_TOKEN_SECRET='REFRESH_TOKEN_SECRET'
const register =   async (req, res) => {
    try { 
        const  {username, password} = req.body;
        if (!(username && password)) {
            return res.status(403).json({message: 'Некорректные данные'})
        }
        const checkUser = await UserModel.findOne()
                .where('username').equals(username)      
                .exec();  
        if (checkUser) {
            return res.status(403).json({message: 'Пользователь с таким ником существует'})
        }
        
        const doc  = new UserModel({
            username: username,
            password: password
        });
        doc.save();  
        res.status(202).json({message: 'Пользователь создать'})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Ошибка регестрации',
        })
    }
};

const login = async(req, res) => {
    try {   
        const  {username, password} = req.body;
        if (!(username && password)) {
            res.status(403).json({message: 'Некорректные данные'})
        }
        const checkUser = await UserModel.findOne()
        .where('username').equals(username)      
        .exec();  
        if (!checkUser) {
            res.status(403).json({message: 'Неверный логин или пароль'});
        }
        const accessToken = jwt.sign({
            id: checkUser._id,
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10m",
        });
        const refreshToken = jwt.sign(
            {
                id: checkUser._id
            },
            REFRESH_TOKEN_SECRET,
            {
            expiresIn: "24h",
        });
        const DAY_IN_SECONDS = 24 * 3600 * 1000;
        await redisClient.set(refreshToken, '1', 'PX', DAY_IN_SECONDS);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken);
        res.redirect("/resource")
    }

    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Ошибка входа',
            err
        })
    }
}

const refreshToken = async(req, res, next) => {
    try {
        const {refreshToken} = req.cookies;

        if (!refreshToken) {
           res.status(403).json({message: 'Proebali'});
        }
        const token = await redisClient.get(refreshToken);
        if (!token) {
           res.status(403).json({message: 'Proebali GG'});
        }
        const {id} = jwt.verify(
           refreshToken,
           REFRESH_TOKEN_SECRET
       );
       const newAccessToken = jwt.sign({id}, ACCESS_TOKEN_SECRET, {
           expiresIn: "10m",
       });
   
       const newRefreshToken = jwt.sign({id}, REFRESH_TOKEN_SECRET, {
           expiresIn: "24h",
       }); 
       const DAY_IN_SECONDS = 24 * 3600 * 1000;
       await redisClient
           .multi()
           .del(refreshToken)
           .set(newRefreshToken, 1, 'PX', DAY_IN_SECONDS)
           .exec();
   
       res.cookie("accessToken", newAccessToken, {
           httpOnly: true,
           sameSite: "strict",
       });

       res.cookie("refreshToken", newRefreshToken);

       res.end();
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Ошибка входа',
            err
        })
    }
}

const logout = async(req, res, next) => {
        const {refreshToken} = req.cookies;
        if (!refreshToken) {
           return res.redirect("/login")
        }

        await redisClient.del(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.redirect("/login")
}

const resource = async(req, res, next) => {
    const user = req.user;
    
    res.json({message:  `RESOURCE 123`});
}

const checkLsit = (req, res) => {

    // Получение списка всех ключей
    redisClient.keys('*', function (err, keys) {
      if (err) return console.log(err);
    
      keys.forEach(function (key) {
        console.log("------------------")
        console.log(key);
      });
    });
    res.redirect("/login")
} 

const flushdb = (req, res) => {
    redisClient.flushdb(function (err, succeeded) {
        if (err) {
            console.error(err);
        } else {
            console.log('Все ключи удалены из текущей базы данных');
        }
    });
    res.redirect("/login")
} 

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    resource,
    checkLsit,
    flushdb,
}
