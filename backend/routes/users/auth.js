const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const config = require('../../config/database');
const User = require('../../models/user');


const comparePassword = (candid, hash) => new Promise((resolve, reject) =>
    bcrypt.compare(candid, hash, (err, isMatch) => {
        if (err) reject(err);
        if (isMatch) resolve(true);
        resolve(false);
    }))

//Authenticattion is a post method
module.exports = (req, res) => {
    const { username, password } = req.body;
    if (username && password) User.getUserByUsername(username).then(user => {
        comparePassword(password, user.password).then(isMatch => {
            if (isMatch) {
                const userData = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    _id: user._id
                };
                const token = jwt.sign({ data: userData }, config.secret, { expiresIn: "604800000" });
                res.cookie('token', token, { maxAge: 604800000, httpOnly: true }).send({ success: true, user: user })
            } else res.status(403).send({ success: false, msg: "Wrong Password" })
        }).catch(err => res.status(500).send(err));
    }).catch(err => res.status(400).send(err));
    else res.status(400).send({ error: 'Bad Request' })
}