const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  users = require('../util/user'),
  config = require('./passport.cred'),
  bcrypt = require('bcrypt-nodejs');

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) token = req.cookies['Bearer'];
  return token;
};
module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = cookieExtractor;

  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    let logovan = undefined;
    await users.forEach( user => {
      if (user._id === payload.id) {
        logovan = true;
        return done(null, user);
      }else {
        return done(null,false);
      }
    });
  }));

  const localOpts = {
    usernameField: 'email'
  };
  passport.use('login', new LocalStrategy(localOpts, async (email, password, done) => {
    console.log(email, password);
    let logovan = undefined;
    await users.forEach(async user => {
      if (user.email === email)
        await bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            logovan = false;
            return done(err, false);
          } else if (isMatch) {
            logovan = true;
            return done(null, user);
          } else {
            logovan = false;
            return done(null, false);
          }
        });
    });
    if (logovan === undefined) {
      return done(null, false);
    }
  }));
};
