const User = require('../../models/user');

//Validate is POST method
module.exports = (req, res) => {
    if (req.body.email) {
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) res.send({
                error: 'error processing request'
            });
            else if (user) res.send({
                success: false,
                msg: "Email is already taken."
            });
            else res.send({
                success: true,
                msg: "Email is valid."
            });
        });
    } else if (req.body.username) {
        User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) res.send({
                error: 'error processing request'
            });
            else if (user) res.send({
                success: false,
                msg: "Username is already taken."
            });
            else res.send({
                success: true,
                msg: "Username is valid."
            });
        });
    } else res.send({
        error: "validation error"
    });
}