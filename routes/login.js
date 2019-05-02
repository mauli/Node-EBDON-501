const express = require('express')
const router = express.Router();
//const Joi = require('@hapi/joi'); //input validation
const User = require('../model/User')
const mongoose = require('mongoose')
const lodash = require('lodash')
const bcrypt = require('bcrypt')
const saltRounds = 10;



// router.post('/signUp', (req, res) => {

//     var promise = User.findOne({ email: req.body.email }).exec();
//     promise.then(function (user) {
//         if (user) {
//             return res.status(400).send('user is already registered')
//         }
//         // const id = new mongoose.Types.ObjectId();
//         // const userToPersist = Object.assign({
//         //     _id: id
//         // }, req.body);

//          const user1 = new User(req.body);
//          return user1.save()
//     })
//         .then(function (user) {
//            return res.json(lodash.pick(user,['id', 'name']));
//         })
//         .catch(function (err) {
//             if (err.name === 'ValidationError') {
//                 return res.status(400).json({ error: err.message });
//             }
//             return res.status(500).send(err); //must be valid 12 digit ID  
//         });
// });


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




module.exports = router


