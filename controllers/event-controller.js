const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const ResultModel = require('../models/Results');
module.exports = {
    eventsGet: async (req, res) => {
        const events = await EventModel.find({
            pastEvent: false,
        })
            .populate('creator')
            .populate({ path: "users[]" })
            .then(async (events) => {
                if (events.length === 0) {
                    res.render('alerts/no-events-in-db');
                    return;
                }

                let modifiedEvents = await events.forEach(async(singleEvent) => {
                
                let userId = req.user._id;
                let usersArr = await singleEvent.users.map((x) => {
                    return x.toString();
                })
                if (usersArr.includes(userId.toString())) {

                    singleEvent.itParticipate = true;
                } else {
                    singleEvent.itParticipate = false;
                }

                let arrUsersId = singleEvent.users.map((userId) => {
                    return userId;
                });

                let usernames = await arrUsersId.map(async (_id) => {
                    let names = UserModel.findById({ _id })
                        .then(async (name) => {
                            return await name.username
                        })
                    return await names;
                })
                Promise.all(usernames)
                    .then((value) => {
                        singleEvent.newUsers = value;

                    })
                })
                res.render('events/index-events', { events });
                

            })
            .catch((err) => {
                console.log(err)
            })

    },
    participatePost: (req, res) => {
        let userId = req.user._id;
        let _id = req.params.id.substr(1);

        EventModel.findById({ _id })
            .then((event) => {
                event.users.push(userId);
                event.save();
                res.redirect('/')
            })
            .catch((err) => {
                console.log(`This is error from retreiving an event ${err}`)
            })
    },
    resultsFromEventsGet: async (req, res) => {
        EventModel.find(({
            pastEvent: false,
        }))
            .then(async (events)=>{
                res.render('events/available-events', {events});
            })
            .catch((err)=>{
                console.log(`The error is getting the events for entering the results ${err}`)
            })
        
    },
    insertResultsFromEventsGet: (req, res) => {
        let _id = req.params.id.substr(1);

        EventModel.findById(_id)
            .populate({path:'users'})
            .then((event)=>{
                res.render('events/results-events', {user:event.users});
            })
            .catch((err)=>{
                console.log(`The error is getting the users from DB to display results ${err}`)
            })
    }
}