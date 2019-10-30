const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const passport = require('passport');

router.get('/me', passport.authenticate('jwt', { session : false }), (req, res, next) => {
    res.json({
        message : "Get User's Profile success !!!",
        user : req.user,
      })
});

router.put('/me/update', passport.authenticate('jwt', { session : false }), userController.update);

module.exports = router;