
const User = require('../../models/user');

module.exports=(req,res)=>{
    if(req.params.text){
        User.queryUsers(req.params.text).then((users)=>{
            res.send(users);
        }).catch(err=>{
            console.log(err.name);
            res.status(400).send(err);
        })
    }
}