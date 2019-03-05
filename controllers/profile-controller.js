const UserModel = require('../models/User');

module.exports = {
    profileGet:async (req, res)=>{

        const userId = req.user._id;
        const name = `${req.user.firstName} ${req.user.lastName}`;
        const personalBalance = req.user.personalBalance;
        const totalBuyIn = req.user.totalBuyIn;
        const totalGames = req.user.event.length;
        
        res.render('profile/index-profile', {
            userId,
            name,
            personalBalance,
            totalBuyIn,
            totalGames
        });
        
    }
}