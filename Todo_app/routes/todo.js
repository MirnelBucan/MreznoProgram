const express = require('express');
const router = express.Router();
const { todo, users ,Sequelize} = require('../models');
/* GET home page. */
router.get('/', async (req, res, next) => {
  console.log("User (inside TODO) : ",req.user);
  let tasks = await todo.findAll({
    where:{ userid: req.user.id },
    attributes: ['id','name'],
    required:false,
    raw:true
  });
  res.render('todo', { taskList: tasks });
});

router.post('/create/task', async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.task);
  try{
    todo.create({
      name: req.body.task,
      userId: req.user.id
    })
  } catch (err){
    console.log(err);
    res.status(400).json(err);
  }
  res.status(200).json(req.body);
});

module.exports = router;
