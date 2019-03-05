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
                let eventId = event._id;
                let eventParticipants = event.participants.map((x)=>{
                    let idToString = x.toString();
                    return idToString;
                });      
                
                let usersMapped = event.users.map((user)=>{
                    let userId = user._id;//this is an object
                    if(!eventParticipants.includes(userId.toString())){
                        let obj={
                            userId,
                            username:`${user.firstName} ${user.lastName}`,
                            eventId,
                            itPart:false
                        };
                        return obj;
                    }else{
                        let obj={
                            userId,
                            username:`${user.firstName} ${user.lastName}`,
                            eventId,
                            itPart:true
                        };
                        return obj;
                    }
                    
                });                               
                res.render('events/results-events', {usersMapped,type:event.type, eventdate:event.eventdate,_id});
            })
            .catch((err)=>{
                console.log(`The error is getting the users from DB to display results ${err}`)
            })
    },
    resultsFromEventsPost:async (req,res)=>{        
        let user = req.params.id.substr(1);
        let event = req.params.eventId.substr(1);
        const buyIn = +req.body.buyIn;
        const cashOut = +req.body.cashOut;   
        
        try{
            const result = await ResultModel.create({
                event,
                user,
                buyIn,
                cashOut
            })
            .then(async (result)=>{

                const resultId = result._id;                
                const userDb = await UserModel.findById(user);               
                let cashBuyBalance = Number(((cashOut-buyIn)*0.01).toFixed(2));                
                const balance =(userDb.personalBalance)+cashBuyBalance;
                const totalBuyIn = userDb.totalBuyIn + buyIn;

                userDb.totalBuyIn = totalBuyIn;
                userDb.personalBalance = balance;                
                userDb.event.push(event);
                userDb.results.push(resultId);
                await userDb.save();

                const eventDb = await EventModel.findById(event);
                eventDb.results.push(resultId);
                eventDb.participants.push(user);
                eventDb.save();               
                res.redirect(`/results/insertresults:${event}`);                
            })
        }
        catch(err){
            console.log(`This error is from freating a result in DB ${err}`)
        }
        
    },
    closeEventPost:async (req,res)=>{
        
        let _id = req.params.id.substr(1);
        try{
            const eventToClose = await EventModel.findById(_id);
            eventToClose.pastEvent = true;
            eventToClose.save();
            res.redirect('/');
        }
        catch(err){
            console.log(`The error is from trying to close the event ${err}`)
        }
        
    },
    pastEventsGet:async (req,res)=>{
        
        try{
            const allEvents = await EventModel.find({
                pastEvent:true
            })
            .populate({ path: 'participants'})
            
            res.render('events/past-events', {allEvents})

        }
        catch(err){
            console.log(`This is an error trying to retreive events from db ${err}`)
        }
        
    },
    pastEventDetailGet:async (req,res)=>{
        const eventId = req.params.id.substr(1);

        try{
            const event = await EventModel.findById({_id:eventId})
                .populate({path:'results', populate:{path:'user'}})
                
            const mappedUserStats = await event.results.map((x)=>{
                let name = `${x.user.firstName} ${x.user.lastName}`
                let buyIn=x.buyIn;
                let cashOut = x.cashOut-buyIn;
                let balancePoints = ((+cashOut)*(0.01)).toFixed(2);                
                let obj = {
                    name,
                    buyIn,
                    cashOut,
                    rankingPoints:0,
                    balancePoints
                };
                return obj;  
            }).sort((a,b)=>b.balancePoints-a.balancePoints);                     
            res.render('events/past-event-details', {mappedUserStats})
        }
        catch(err){
            console.log(`This is an error trying to retreive an event from DB: ${err}`)
        }
    },

}