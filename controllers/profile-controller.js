const UserModel = require('../models/User');
const ResultModel = require('../models/Results');
module.exports = {
    //rendering user's stats from the database
    profileGet:async (req, res)=>{
        const userId = req.user._id;
        const name = `${req.user.firstName} ${req.user.lastName}`;
        const personalBalance = req.user.personalBalance.toFixed(2);
        const totalBuyIn = req.user.totalBuyIn;
        const totalGames = req.user.event.length;
        const totalPoints = req.user.totalPoints.toFixed(2);
        res.render('profile/index-profile', {
            userId,
            name,
            personalBalance,
            totalPoints,
            totalBuyIn,
            totalGames
        });        
    },
    //rendering all games that user participates
    profileAllGamesGet:async (req,res)=>{
        const userId = req.params.id.substr(1);        
        const allGames = await ResultModel.find({
            user:userId
        })
        .populate('event')
        .sort({event:"desc"})
        
        res.render('profile/profile-all-games', {allGames});
    }
}