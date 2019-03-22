const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const ResultModel = require('../models/Results');
module.exports = {
    //render all available events
    eventsGet: async (req, res) => {
        //find only not past events
        const eventsF = await EventModel.find({
            pastEvent: false,
        })
            .populate('creator')
            .populate({ path: "users[]" })
            .then(async (events) => {                
                if (events.length === 0) {
                    res.render('alerts/no-events-in-db');
                    return;
                }
                let userId = req.user._id;
                let modifiedEvents = await events.map(async(singleEvent) => {
                    let obj={};
                    obj.eventdate = singleEvent.eventdate;
                    obj.time = singleEvent.time;
                    obj.place = singleEvent.place;
                    obj._id = singleEvent._id;
                    let usersArr = await singleEvent.users.map((x) => {
                    return x.toString();
                    })
                
                if (usersArr.includes(userId.toString())) {
                    obj.itParticipate = true;
                } else {
                    obj.itParticipate = false;
                }
                let arrUsersId = await singleEvent.users.map((userId) => {
                    return userId;
                });
                let usernames = await arrUsersId.map(async (_id) => {
                    let names = UserModel.findById({ _id })
                        .then(async (name) => {
                            return await `${name.firstName} ${name.lastName}`;
                        })
                    return await names;
                })
                await Promise.all(usernames)
                    .then((value) => {
                        obj.newUsers = value;
                    })
                    return await obj;
                });    
                Promise.all(modifiedEvents)
                .then((valueDb)=>{
                    res.render('events/index-events', { events:valueDb }); 
                })                
            })
            .catch((err) => {
                console.log(`This is an error from getting all available events from DB`)
            });
             
    },
    //participate in an event
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
    //rendering all participants in an event
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
    //retreiving the info regarding the event and users that participate int the event
    insertResultsFromEventsGet: (req, res) => {
        //event ID
        let _id = req.params.id.substr(1);
        EventModel.findById(_id)
            .populate({path:'users'})
            .then((event)=>{
                let eventId = event._id;
                let eventParticipants = event.participants.map((x)=>{
                    let idToString = x.toString();
                    return idToString;
                });
                //preparing the rendering
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
    //entering result from an event in DB using the model and in user's personal BD record
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
                cashOut,
                totalPoints:0,
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
            console.log(`This error is from creating a result in DB ${err}`)
        }
        
    },
    //making an event "past"
    closeEventPost:async (req,res)=>{        
        let _id = req.params.id.substr(1);
        try{
            const eventToClose = await EventModel.findById(_id)
            .populate({path:"results",populate:{path:"user"}})
            .populate({path:"participants"});
            let totalSum = 0;
            let totalParticipants = eventToClose.results.length;
            let eventScore = eventToClose.results
            .map((result)=>{
                let userId = result.user._id;
                let resultId = result._id;               
                let eventTotal = result.cashOut - result.buyIn;  
                if(eventTotal>=0){
                    totalSum+=eventTotal
                }              
                return{
                    resultId,
                    userId,
                    eventTotal,
                    rankingPoints:0,
                }
            })
            .sort((a,b)=>b.eventTotal - a.eventTotal)
            .map(async (score,index)=>{                           
                let userId = score.userId;                
                let eventTotal=score.eventTotal;
                let rankingPoints=score.rankingPoints;
                if(eventTotal>0){
                    rankingPoints += Number(((eventTotal/totalSum)*100).toFixed(2));
                }else if(eventTotal<0){
                    rankingPoints += Number(((eventTotal/totalSum)*100).toFixed(2));
                }                
                if(index===0){
                    rankingPoints+=10
                }
                if(index===(totalParticipants-1)){
                    rankingPoints-=10
                }   
                const resultDb = await ResultModel.findById({
                    _id:score.resultId
                });
                resultDb.totalPoints = rankingPoints;
                resultDb.save();
                return{
                    userId,
                    eventTotal,
                    rankingPoints
                }
            })
            Promise.all(eventScore)
            .then((x)=>{
                x.forEach(async(obj)=>{                    
                    let totalPoints = obj.rankingPoints;
                    let userToUpdate = await UserModel.findById({_id:obj.userId});                             
                    userToUpdate.totalPoints+=Number(totalPoints.toFixed(2));
                    userToUpdate.save();
                })
            })
            eventToClose.pastEvent = true;
            eventToClose.save();
            res.redirect('/');
        }
        catch(err){
            console.log(`The error is from trying to close the event ${err}`);
        }        
    },
    //rendering all "past" events in desc order
    pastEventsGet:async (req,res)=>{        
        try{
            const allEvents = await EventModel.find({
                pastEvent:true
            })
            .populate({ path: 'participants'})
            .sort({eventdate:"desc"});
            
            res.render('events/past-events', {allEvents})
        }
        catch(err){
            console.log(`This is an error trying to retreive events from db ${err}`)
        }        
    },
    //rendering the details of a "past" event
    pastEventDetailGet:async (req,res)=>{
        const eventId = req.params.id.substr(1);
        try{
            const event = await EventModel.findById({_id:eventId})
                .populate({path:'results', populate:{path:'user'}});                
            const mappedUserStats = await event.results.map((x)=>{
                let name = `${x.user.firstName} ${x.user.lastName}`
                let buyIn=x.buyIn;
                let rankingPoints = x.totalPoints;
                let cashOut = x.cashOut-buyIn;
                let balancePoints = ((+cashOut)*(0.01)).toFixed(2);                
                let obj = {
                    name,
                    buyIn,
                    cashOut,
                    rankingPoints,
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