const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    res.render('Insurance Agent/customer');
});

router.post('/submit', (req, res) => {
    let data = req.body;
    res.send('Data received: ' + JSON.stringify(data));
});

module.exports = router;