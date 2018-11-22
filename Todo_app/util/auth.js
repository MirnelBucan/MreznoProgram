const { users } = require('../models'),
  passport = require('passport');

module.exports = () => {
  return (req, res, next) => {
    if (req.url === '/' || req.url === '/users/login' || req.url === '/users/register')
      next();
    else {
      passport.authenticate('jwt',(err, user, info)=>{
        if(err){
          next(err);
        }
        console.log(err,user,info);
        if(info !== undefined){
          if((info.message ==='No auth token' || info.message ==='invalid token') && !(req.url === '/todo/create/task'))
            res.redirect('/users/login');
          else if((info.message ==='No auth token' || info.message ==='invalid token') && req.url === '/todo/create/task')
            res.status(401).json({redirect:'/users/login'});
          else if(info.message ==='jwt Expired')
            res.status(400).json({redirect:'/users/login',msg:'Login session expired!'});
        }
        else if(user){
          req.user=user;
            next();
        }
      })(req, res, next);
    }
  };
};