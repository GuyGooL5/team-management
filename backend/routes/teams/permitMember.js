const Team = require('../../models/team');

module.exports = (req,res)=>{
    if(req.user._id){
        let team_id,member_id,permission;
        if(req.body.team_id) team_id=req.body.team_id;
        else res.status(403).send({error:"Please select team"});
        if(req.body.member_id) member_id = req.body.member_id;
        else res.status(403).send({error:"Please select member"})
        if(req.body.permission=="member" || req.body.permission=="manager") permission = req.body.permission;
        else res.status(403).send({error:"Please specify a valid permission"})
        if(team_id && member_id && permission){
            Team.permitMember(team_id,req.user._id,member_id,permission,(err,success)=>{
                if(err) res.send(err)
                else{
                    if(success) res.send({success:true,msg:"Promoted new member."});
                    else res.status(500).send({error:"Error promoting member"});
                }
            })
        }
    }else res.status(401).send({error:"Unautherized Action"})
}