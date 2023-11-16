const express = require('express');
const { getAllUsers, signUp, login, updatUser, deleteUser } = require('../controllers/userController');
const routes = express.Router();
const { body } = require('express-validator');

routes.get('/', getAllUsers)
routes.post('/signup', [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
   signUp)
routes.post('/login',[
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
], login)
routes.put('/:id', updatUser)
routes.delete('/:id', deleteUser)
module.exports = routes