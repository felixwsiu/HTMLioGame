const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/',(req,res) => res.render('welcome'));

//Game

router.get('/game',ensureAuthenticated, (req,res) => res.sendFile(__dirname + '/client/index.html', { name: req.user.name }));

module.exports = router;
