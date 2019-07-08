
const User = require('../../models/user');

module.exports = (req, res) => {
    if (req.params.text) User.queryUsers(req.params.text).then((users) => res.send(users)).catch(err => res.status(400).send(err));
}