const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const config = require('../../config/database');
const User = require('../../models/user');


const comparePassword = (candid, hash, callback) => {
    bcrypt.compare(candid, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

//Authenticattion is a post method
module.exports = (req, res) => {
    const {
        username,
        password
    } = req.body;

    if(username && password) User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        else if (!user) return res.json({
            success: false,
            msg: 'User not found'
        });
        else comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            else if (isMatch) {
                const token = jwt.sign({
                    data: user
                }, config.secret, {
                    expiresIn: "604800000"
                });
                res.cookie('token', token, {
                    maxAge: 604800000,
                    httpOnly: true
                });
                res.json({
                    success: true,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        firstname: user.firstname,
                        lastname:user.lastname
                    }
                })
            } else res.json({
                success: false,
                msg: 'Wrong password'
            })
        });
    });
    else res.status(400).send({error:'Bad Request'})
}