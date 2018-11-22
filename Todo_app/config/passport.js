const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  config = require('./passport.cred'),
  comparePassword = require('../util/comparePassword'),
  { users } = require('../models');

const cookieExtractor = function(req) {
  let token = null;
  console.log(req.cookies);
  if (req && req.cookies) token = req.cookies['Bearer'];
  return token;
};
module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = cookieExtractor;

  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    console.log("Payload: ",payload);
    try{
      let user = await users.findById(payload.id);
      if(user) done(null,user.dataValues);
      else done(null, false);
    }catch (err){
      console.log(err);
      done(err,null);
    }
  }));

  const localOpts = {
    usernameField: 'email'
  };
  passport.use('login', new LocalStrategy(localOpts,async (email, password, done) => {
    try{
      let user = await users.findOne({where: {email: email}});
      if(user){
        let isMatch = await comparePassword(password, user.dataValues.password);
        if(isMatch)
          return done(null,user.dataValues);
      }
      return done(null,false);

    } catch (err){
      console.log(err);
      return done(err,null);
    }
  }));
};
