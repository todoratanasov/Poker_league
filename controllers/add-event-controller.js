const EventModel = require('../models/Event');


module.exports = {
    addEventGet: (req, res) => {
        res.render('add-event/index-add-event');
    },
    addEventPost: async (req, res) => {
        let { type, eventdate, place, maxplayers,time } = req.body;
        maxplayers = Number(maxplayers);
        let creator = req.user._id;
        try {
            const event = await EventModel.create({
                type,
                eventdate,
                place,
                maxplayers,
                time,
                creator: [creator],
                users: [creator],
                pastEvent:false,
                participants:[],
            });
            res.redirect("/");
        } catch (err) {
            console.log(err);
        }


    }
}