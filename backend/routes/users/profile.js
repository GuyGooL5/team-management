const User = require('../../models/user');
const passport = require('passport');

//Profile has GET method
module.exports = (req, res) => {
    User.findById(req.user._id,'username email firstname lastname _id',(err, user) => {
        if (err) res.status(401).send('Unautherized').cookie('token', null);
        else res.status(200).send({user:user})
    })
};