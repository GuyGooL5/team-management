const User = require('../../models/user');


//Register is post method
module.exports = (req, res) => {
    //variable that stores form information
    let bodyObj = {}
    //tests each form field validity and returns errors if there are any
    if (req.body.firstName) bodyObj.firstname = req.body.firstName;
    if (req.body.lastName) bodyObj.lastname = req.body.lastName;
    if (req.body.username) bodyObj.username = req.body.username;
    else res.status(400).send({
        error: "Inavild User Name"
    });
    if (req.body.email) bodyObj.email = req.body.email;
    else res.status(400).send({
        error: "Email field is invalid"
    })
    if (req.body.password) bodyObj.password = req.body.password;
    else res.status(400).send({
        error: "Invalid Password"
    });

    //create new user model in database
    let newUser = new User(bodyObj);

    //use custom method from user model class to create a user and return a success message
    User.addUser(newUser, (err, user) => {
        if (err) res.send({
            success: false,
            msg: 'Failed to register user'
        });
        else res.send({
            success: true,
            msg: 'User Registered'
        });
    });
}