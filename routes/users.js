const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/login', userController.login);


module.exports = router;