const User = require('../../models/user');


//Register is post method
module.exports = (req, res) => {
    //variable that stores form information
    const { firstName, lastName, username, email, password } = req.body;
    const reqBody = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password
    }
    //tests each form field validity and returns errors if there are any
    if (!username) res.status(400).send({ error: "Invalid or empty Username" });
    else if (!email) res.status(400).send({ error: "Invalid or empty Email" })
    else if (!password) res.status(400).send({ error: "Invalid or empty Password" });
    if (username && email && password) {
        //create new user model in database
        const newUser = User.newUserModel(reqBody);

        //use custom method from user model class to create a user and return a success message
        User.createUser(newUser).then(success => res.json(success))
            .catch(err => res.status(400).json(err));
    }
}