const User = require('../../models/user');
const passport = require('passport');

//Profile has GET method
module.exports = (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) res.status(401).send('Unautherized').cookie('token', null);
        res.status(200).send({
            user: {
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            }
        })
    })
};