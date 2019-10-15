const express = require('express');
const router = express.Router();
// const indexController = require('../controllers/index');
const passport = require('passport');

router.get('/me', passport.authenticate('jwt', { session : false }), (req, res, next) => {
    res.json({
        message : 'You made it to the secure route',
        user : req.user,
        token : req.query.secret_token
      })
});

module.exports = router;