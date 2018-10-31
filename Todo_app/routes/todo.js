const express = require('express');
const router = express.Router();
const users = require('../util/user');
/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("INSIDE TODO");
  let usr = users.filter(user => user._id === req.user._id);
  res.render('todo', { usr: usr[0] });
});
router.post('/create/task',(req, res, next) => {
  users.forEach(user => {
    if(user._id === req.user._id){
      user.todo.push(req.body.task);
    }
  });
  res.status(200).json(req.body);
});

module.exports = router;
