const users = require('./user');
module.exports = () => {
    return (req, res, next) => {
        console.log(req.url);
        if (req.url === '/' || req.url === '/users/login' || req.url === '/users/register')
            next();
        else{
            if(req.cookie === null || req.cookie === '' ){
                res.location('/users/login');
                res.redirect('/users/login');
            } else {
                let logovan = false;
                users.forEach(user => {
                  if(user.cookieID === req.cookies._id){
                    logovan = true;
                    next();
                }
                });
                if(logovan === false)
                    res.location('/users/login').redirect('/users/login');
            }
        }
    };
};