const EventModel = require('../models/Event');
const UserModel = require('../models/User');
module.exports = {
    index: (req, res) => {    
       res.render('home/index_bootstrap.hbs')
        
    }
};