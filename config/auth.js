module.exports = {
    //check if the user has role "Test"
    isTest: (req,res,next)=>{
        if(req.user.roles.includes("Test")){
            res.render('alerts/big-alert', {
                title:"Ooops - You are not allow to do that!",
                content:"Please go to the login menu and enter your credentials!"
            })
        }else{
            next()
        }
    },
    //check if the user is authed
    isAuthed: (req, res, next) => {        
        if (req.isAuthenticated()) {
            next();
        } else {
            res.render('alerts/big-alert', {
                title:"Ooops - You are not allow to do that!",
                content:"Please go to the login menu and enter your credentials!"
            })
        }
    },
    //restrict only a certain user can preform the action 
    hasRole: (role) => (req, res, next) => {             
        if (req.isAuthenticated() &&        
            req.user.roles.indexOf(role) > -1) {
            next();
        } else {            
            res.render('alerts/big-alert', {
                title:"Ooops - You are not allow to do that!",
                content:"Please go to the login menu and enter your credentials!"
        })
        }
    },
    //check if the user is not logged in
    isAnonymous: (req, res, next) => {
        
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    }
}