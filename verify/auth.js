const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports.auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    if (typeof authHeader === 'undefined') {
        res.sendStatus(403);
    } else {
        jwt.verify(authHeader, config.secret, (err, decoded) => {
            if (err) res.sendStatus(403);
            else {
                req.token = authHeader;
                req.data = decoded.user;
                next();
            }
        });
    }
  }