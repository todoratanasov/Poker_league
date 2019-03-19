module.exports = {
    development: {
        port: process.env.PORT || 3000,
        // dbPath: 'mongodb://localhost:27017/casino-lounge' - localDB
        dbPath: 'mongodb://atanasov.t:letsplay69@ds217976.mlab.com:17976/casino_lounge'
    },
    production: {
        port: process.env.PORT || 3000,
        // dbPath: 'mongodb://localhost:27017/casino-lounge' - localDB
        dbPath: 'mongodb://atanasov.t:letsplay69@ds217976.mlab.com:17976/casino_lounge'
    }
};