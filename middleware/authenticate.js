const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log('token-----', token)
        const retrivedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = retrivedToken;
        next();
    } catch (error) {
        console.log('error is', error)
        res.status(401).json(error);
    }
};