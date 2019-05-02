
module.exports = (req, res, next) => {
    //401 UNauthenticated
    //403 Forbidden  https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses

    console.log('req.user.role===', req.user.role)
    if(req.user.role != 'ADMIN') {
       return res.status(403).json('Access Denied');
    }
    next()
};