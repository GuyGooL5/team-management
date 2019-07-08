const User = require('../../models/user');

//Validate is POST method
module.exports = (req, res) => {
    let { email, username } = req.body;
    if (email) User.validateEmailNotTaken(email).then(success => res.send(success))
        .catch(err => res.status(500).send(err));
    else if (username) User.validateUsernameNotTaken(username).then(success => res.send(success))
        .catch(err => res.status(500).send(err));
    else res.status.send({ error: "validation error" });
}