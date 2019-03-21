const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    //home
    app.get('/', controllers.home.index);

    //standings
    app.get('/standings', restrictedPages.isAuthed, controllers.standings.standingsGet)

    //user
    //register works only using URL and if logged as Admin
    app.get('/register', restrictedPages.isAuthed, restrictedPages.hasRole('Admin'), controllers.user.registerGet);
    app.post('/register', restrictedPages.isAuthed, restrictedPages.hasRole('Admin'), controllers.user.registerPost);

    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    //review events
    app.get('/upcomming', restrictedPages.isAuthed, controllers.events.eventsGet);

    //add event
    app.get('/addevent', restrictedPages.isAuthed, controllers.addEvent.addEventGet);
    app.post('/addevent/post', restrictedPages.isAuthed, restrictedPages.isTest,controllers.addEvent.addEventPost)

    //participate in event
    app.post('/participate:id', restrictedPages.isAuthed, restrictedPages.isTest,controllers.events.participatePost)

    //rules
    app.get('/rules',  controllers.rules.rulesGet);

    //results
    app.get('/results', restrictedPages.isAuthed, controllers.events.resultsFromEventsGet)
    app.get('/results/insertresults:id', restrictedPages.isAuthed, controllers.events.insertResultsFromEventsGet);
    app.post('/results/:id/:eventId', restrictedPages.isAuthed, restrictedPages.hasRole('Boss'),restrictedPages.isTest,controllers.events.resultsFromEventsPost)

    //close an event
    app.get('/results/closeevent:id', restrictedPages.isAuthed, restrictedPages.isTest, restrictedPages.hasRole('Boss'), controllers.events.closeEventPost)
    //profile
    app.get('/profile', restrictedPages.isAuthed, controllers.profile.profileGet)
    app.get('/profileallgames:id', restrictedPages.isAuthed, controllers.profile.profileAllGamesGet)

    //past events
    app.get('/pastevents', restrictedPages.isAuthed, controllers.events.pastEventsGet);
    app.get('/pastevents/details:id', restrictedPages.isAuthed, controllers.events.pastEventDetailGet);
    
    app.all('*', (req, res) => {
        res.render('alerts/big-alert', {
            title:"Ooops - it's 404 Not Found",
            content:"The url you're trying to reach does not exist!"
    })
    });
};