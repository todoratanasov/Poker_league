const home = require('./home-controller');
const user = require('./user-controller');
const addEvent = require('./add-event-controller')
const rules = require('./rules-controller');
const profile = require('./profile-controller');
const standings = require('./standings-controller');
const events = require('./event-controller');
//exporting all controllers
module.exports = {
    home,
    user,
    events,
    addEvent,
    rules,
    profile,
    standings
};