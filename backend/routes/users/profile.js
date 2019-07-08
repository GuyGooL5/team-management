const User = require('../../models/user');
const passport = require('passport');

//Profile has GET method
module.exports = (req, res) => {
    if (req.user._id) User.getUserDetails(req.user._id)
        .then(user => res.send(user))
        .catch(err => res.status(400).send(err).cookie('token', null));
    else res.status(401).send({ error: "Unauthorized" }).cookie('token', null);
};