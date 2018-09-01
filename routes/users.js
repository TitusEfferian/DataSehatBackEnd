const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const verify = require('../verify/auth');
const config = require('../config/database');

// Register 
router.post('/register', (req, res, next) => {
    const newUser = new User({
        ktp: req.body.ktp,
        password: req.body.password
    });

    // Check if user exist
    new Promise((resolve, reject) => {
        User.getUserByKTP(req.body.ktp, (err, user) => {
            if (err) reject(err);
            if (!user) {
                // Add new user
                User.addUser(newUser, (err, user) => {
                    if (err) reject('Failed to register new user!');
                    else resolve();
                })
            }
            else reject('KTP already exist!')
        });
    }).then(() => {
        res.json({
            success: true,
            message: 'Successfully register new user!'
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        });
    });
});

// Login 
router.post('/login', (req, res, next) => {
    const ktp = req.body.ktp;
    const password = req.body.password;

    // Check if user exist
    new Promise((resolve, reject) => {
        User.getUserByKTP(ktp, (err, user) => {
            if (err) reject(err);
            if (!user) reject('KTP number is not registered')
            else {
                // Compare password
                User.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) reject(err);
                    if (isMatch) {
                        jwt.sign({ user }, config.secret, (err, token) => {
                            if (err) reject(err);
                            else resolve(token);
                        })
                    } else reject("Incorrect password");
                });
            }
        });
    }).then((token) => {
        res.json({
            success: true,
            token: token,
            message: 'Login successful'
        });
    }).catch((err) => {
        return res.json({
            success: false,
            message: err
        });
    });
});

// User Info 
router.get('/info', verify.auth, (req, res, next) => {
    User.getUserById(req.data._id, (err, user) => {
        if (err) {
            res.json({
                success: false,
                message: 'Failed to get user info.'
            });
        } else {
            res.json({
                success: true,
                data: {
                    user
                }
            });
        }
    });
});

module.exports = router;