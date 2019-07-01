const jwt = require('jsonwebtoken');


const config = require('../../config/database');
const User = require('../../models/user');

//Authenticattion is a post method
module.exports = (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({
            success: false,
            msg: 'User not found'
        });
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    data: user
                }, config.secret, {
                    expiresIn: "604800"
                });
                res.cookie('token', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    httpOnly: true
                });
                res.json({
                    success: true,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        name: user.name
                    }
                })
            } else res.json({
                success: false,
                msg: 'Wrong password'
            })
        });
    });
}