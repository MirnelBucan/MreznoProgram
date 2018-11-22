const express = require('express'),
  router = express.Router(),
  uuid = require('uuid/v1'),
  cryptPassword = require('../util/cryptPassword'),
  passport = require('passport'),
  config = require('../config/passport.cred'),
  sanitizeUser = require('../util/sanitizeUser'),
  jwt = require('jsonwebtoken'),
  { users } = require('../models');

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', errors: null });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', errors: null });
});
router.post('/login',passport.authenticate('login', { session: false }), function(req, res, next){
  const usr = sanitizeUser(req.user);
  const token = jwt.sign(usr,config.secret, { expiresIn: '5m'});
  const expires= new Date(Date.now()+(1000*60*5));
  console.log(expires);
  res.cookie('Bearer',token,{httpOnly:true,expires:expires}).json({token: `${token}`, succes: true});
});

router.post('/register',async function(req, res, next){
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  // Form Validator
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check Errors
  const errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    try {
      password = await cryptPassword(password);
      let user = await users.create({
        username: username,
        password: password,
        email: email
      });
      res.redirect('/users/login');
    } catch (err) {
      console.log(err);
      res.render('register', {errors: [{msg: 'User already exists'}]});
    }
  }
});

router.get('/logout', function(req, res) {
  res.clearCookie('Bearer');
  res.redirect('/users/login');
});

module.exports = router;