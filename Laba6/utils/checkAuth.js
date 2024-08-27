const  Jwt  =  require("jsonwebtoken");

module.exports = {
     checkAuth: (req, res, next) => {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (token) {
            try{ 
                const decoded = Jwt.verify(token, 'hi');
                console.log(decoded);
                req.userId = decoded._id;
                next();
            }   
            catch(err) {
                return res.status(403).json({
                    message: 'Нет доступа 2',
                });
            }
        }
        else {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    }
} 