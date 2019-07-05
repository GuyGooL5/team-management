const Team = require('../../models/team');

module.exports = (req,res)=>{
    if(req.user._id){
        let team_id,member_id;
        if(req.body.team_id) team_id=req.body.team_id;
        else res.status(400).send({error:"Please select team"});
        if(req.body.member_id) member_id = req.body.member_id;
        else res.status(400).send({error:"Please select member"})
        if(team_id && member_id) Team.addMember(team_id,req.user._id,member_id,(err,success)=>{
            if(err) res.send(err)
            else{
                if(success) res.send({success:true,msg:"Added new member."});
                else res.status(500).send({error:"Error adding new member"});
            }
        })
        else res.status(400).send({error:"Bad request"});
    }else res.status(401).send({error:"Unautherized Action"})
}