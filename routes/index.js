const express = require('express');
const router = express.Router();
// const indexController = require('../controllers/index');
const passport = require('passport');

router.get('/me', passport.authenticate('jwt', { session : false }), (req, res, next) => {
    res.json({
        message : "Get User's Profile success !!!",
        user : req.user,
      })
});

module.exports = router;