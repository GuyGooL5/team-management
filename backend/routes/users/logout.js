
//Logout has GET method
module.exports = (req, res) => {
    res.cookie('token', '', { maxAge: 0 }).send({ success: true, msg: "logout successful" })
}