const EventModel = require('../models/Event');
const UserModel = require('../models/User');
module.exports = {
    //rendering the home screen
    index: async (req, res) => {         
        try{
            const users = await UserModel.find({
                roles:"User"
            });
            //retreiving all users an their stats for the homepage's small profiles and sortng them by rank
            const mappedUsers = await users.map((usersDb)=>{
                let name = `${usersDb.firstName} ${usersDb.lastName}`;
                let totalPoints = usersDb.totalPoints.toFixed(2);
                let picture = usersDb.picture;
                let totalBuyIn = usersDb.totalBuyIn;
                let obj = {
                    name,
                    totalPoints,
                    picture,
                    totalBuyIn
                }
                return obj;
            }).sort((a,b)=>b.totalPoints-a.totalPoints||a.totalBuyIn-b.totalBuyIn);
            res.render('home/index_bootstrap.hbs', {mappedUsers})
        }
        catch(err){
            console.log(`This is an error from homepage ${err}`);
        }
    }
};