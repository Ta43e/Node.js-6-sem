const { validationResult } = require("express-validator")

module.exports = {
    heandleValidationErrors: (res, req, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        next();
    }
} 