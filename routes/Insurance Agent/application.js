const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('Insurance Agent/application');
});
module.exports = router;