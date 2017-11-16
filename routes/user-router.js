const express = require('express');
const router  = express.Router();



router.get('/', (req, res, next) => {
  res.render('user-views/landing-page.ejs');
});

/* GET home page. */


router.get('/homepage', (req, res, next) => {
  res.render('homepage');
});

module.exports = router;
