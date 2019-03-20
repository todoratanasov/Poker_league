const EventModel = require('../models/Event');
const nodemailer = require('../helpers/nodemailer');

module.exports = {
    //render the add event form
    addEventGet: (req, res) => {
        res.render('add-event/index-add-event');
    },
    //post the event to the DB
    addEventPost: async (req, res) => {
        let { type, eventdate, place, maxplayers,time } = req.body;
        maxplayers = Number(maxplayers);
        let creator = req.user._id;
        const currentUser = req.user.firstName;
        try {
            //create the data from the model
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
            //send a mail to all users that an event is created
            nodemailer.sendMail(event,currentUser);
            res.redirect("/");
        } catch (err) {
            
            console.log("A problem with DB validation!");
        }


    }
}