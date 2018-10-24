const express = require('express');
const router = express.Router();
const users = require('../util/user');
const uuid = require('uuid');

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register', errors: null});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login', errors: null});
});

router.post('/login', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password field is required').notEmpty();

  const errors = req.validationErrors();
  let logovan = false;
  if(errors){
    res.render('login', {
      errors: errors
    });
  } else{
      if(req.cookies !== null)
        res.clearCookie('_id');
      let logovan = false;
      users.forEach(user => {
        if(user.email === email && user.password === password){
          user.cookieID = uuid();
          logovan = true;
          res.cookie('_id',user.cookieID)
             .location('/todo')
             .redirect('/todo');
        }
      });
      console.log(logovan);
      if(!logovan)
        res.render('login',{ errors:[{msg: 'Invalid email/password'}] });
  }
});

router.post('/register',function(req, res, next) {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  // Form Validator
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  const errors = req.validationErrors();

  if(errors){
  	res.render('register', {
  		errors: errors
  	});
  } else{
    if(users.filter(user => user.email === email).length == 0){
      users.push({
        username:username,
        email:email,
        password:password,
        cookieID: null,
        todo:[]
      });
      console.log(users);
      res.location('/users/login');
      res.redirect('/users/login');
    }else{
      res.render('register',{ errors:[{msg: 'User already exists'}] });
    }
  };
});

router.get('/logout', function(req, res){
  users.forEach(user => {
    if(user.cookieID === req.cookies._id)
      user.cookieID === null;
  });
  res.clearCookie('_id').location('/users/login').redirect('/users/login');

});

module.exports = router;
