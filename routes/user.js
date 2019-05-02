const express = require('express')
const router = express.Router();
//const Joi = require('@hapi/joi'); //input validation
const User = require('../model/User')
const mongoose = require('mongoose')
const lodash = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const saltRounds = 10;
const logger = require('../helper/logger')
require('express-async-errors');


router.post('/signUp', (req, res) => {

    var promise = User.findOne({ email: req.body.email }).exec();
    promise.then(async function (user) {
        if (user) {
            console.log('user is ', user)
            throw new Error('user is already registered');
        }
        const user1 = new User(req.body)
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(req.body.password, salt)
        user1.password = hashed
        return user1.save()
    }).
        then(function (user) {
            return res.json(lodash.pick(user, ['id', 'name']));
        })
        .catch(function (err) {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).send(err.message); //must be valid 12 digit ID  
        });
});

router.post('/login', (req, res, next) => {
    
    logger.error('This is from winston')
    var promise = User.findOne({ email: req.body.email }).exec();
    promise.then(async function (user) {

        const isValidPass = await bcrypt.compare(req.body.password, user.password);
        if (isValidPass) {
            return res.status(200).json({
                token: user.generateAuthToken(),
                expiresIn: process.env.JWT_EXPIRATION_TIME
            });
        }
        return res.send("Invalid username or passwpord")
    })
        .catch(function (err) {
            return next(err)

            // if (err.name === 'ValidationError') {
            //     return res.status(400).json({ error: err.message });
            // }
            // return res.status(500).send(err.message);
        });
});

router.post('/testAsycErrorWithoutTryCatch', authenticate, async (req, res) => {
     
   const users = await User.findById(req.user._id);
   res.send(users)
    
});


router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
});


router.get('/profile', authenticate, (req, res) => {
    console.log("id---", req.user._id);

    var promise = User.findById(req.user._id).exec();
    promise.then(function (customer) {
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send(`User with id ${req.params.id} not found.`);
        }
    })
        .catch(function (err) {
            return res.status(500).send(err); //must be valid 12 digit ID 
        });
})

module.exports = router
