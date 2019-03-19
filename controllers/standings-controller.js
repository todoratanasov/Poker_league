const UserModel = require('../models/User')

module.exports = {
    standingsGet: async (req,res)=>{
        try{
            const usersDb = await UserModel.find({
                roles:"User"
            })
            .populate({path:"results"});
            const mappedUsers = usersDb.map((user)=>{
                let name = `${user.firstName} ${user.lastName}`;
                let games = user.results.length;                
                let buyIn = user.totalBuyIn;                
                let balance = user.personalBalance;
                let points = user.totalPoints;
                return{
                    name,
                    games,
                    buyIn,
                    balance,
                    points
                }
            }).sort((a,b)=>b.points - a.points);
            res.render('standings/index-standings', {mappedUsers});
        }
        catch(err){
            console.log(`Error while retreiving users from DB ${err}`)
        }
    }
}