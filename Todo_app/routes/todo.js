const express = require('express');
const router = express.Router();
const users = require('../util/user');
/* GET home page. */
router.get('/', (req, res, next) => {
  let usr = users.filter(user => user.cookieID === req.cookies._id);
  console.log(usr[0]);
  res.render('todo', { usr: usr[0] });
});
router.post('/create/task',(req, res, next) => {
  users.forEach(user => {
    if(user.cookieID === req.cookies._id){
      user.todo.push(req.body.task);
      console.log(user);
    }
  });
  res.status(200).json(req.body);
});

module.exports = router;
