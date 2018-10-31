const users = require('./user'),
  passport = require('passport');

module.exports = () => {
  return (req, res, next) => {
    if (req.url === '/' || req.url === '/users/login' || req.url === '/users/register')
      next();
    else {
      passport.authenticate('jwt',(err, user, info)=>{
        if(err){
          console.log(err);
          next(err);
        }
        if(!user)
          res.redirect('/users/login');
        else{
          req.user=user;
            next();
          }
      })(req, res, next);
    }
  };
};