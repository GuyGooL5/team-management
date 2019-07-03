const User = require('../../models/user');
const Team = require('../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.user._id) {
        Team.deleteTeam(req.params.id,req.user._id,(err,success)=>{
            if(err) res.status(500).send(err);
            else{
                if(success) res.send({success:true,msg:"Successfuly deleted team."});
                else res.status(401).send({success:false,msg:'Unauthorized Action'});
            }
        });
    }else res.status(401).send({error:"Unauthorized."})
}