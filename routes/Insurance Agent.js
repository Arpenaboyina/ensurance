const express = require('express');
const router = express.Router();


const customerRoute = require('./Insurance Agent/customer');
const applicationRoute = require('./Insurance Agent/application');

router.use('/customer', customerRoute);
router.use('/application', applicationRoute);

router.get('/', function(req, res) {
    res.render('Insurance Agent');
});
module.exports = router;