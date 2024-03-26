const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// const validateRegisterInput = require('../validation/register');
// const validateLoginInput = require('../validation/login');
const User = require('../models/User');

router.post('/signup', (req, res) => {
    // const { errors, isValid } = validateRegisterInput(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    console.log(req.body)
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            return res.status(200).json({message: 'User added successfully. Refreshing data...'})
                        }).catch(err => console.log(err));
                });
            });
        }
    });
    return res.json(req.body);
});

router.post('/reset', (req, res) => {
    let password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }
            password = hash;

            User.findOneAndUpdate({ email: req.body.email }, { password: password }, { new: true })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: "User not found" });
                    }
                    res.json("Update successful!");
                })
                .catch(err => {
                    res.status(500).json({ error: err.message });
                });
        });
    });
});
router.post('/login', (req, res) => {
    // const { errors, isValid } = validateLoginInput(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: 'Email not found' });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            user
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ password: 'Password incorrect' });
            }
        });
    });
});


module.exports = router;
