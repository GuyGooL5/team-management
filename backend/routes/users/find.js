
const User = require('../../models/user');

module.exports=(req,res)=>{
    if(req.params.text){
        User.queryUsers(req.params.text,(err,users)=>{
            if(err) res.send({});
            else if(users){
                res.send(users);
            }
        })
    }
}