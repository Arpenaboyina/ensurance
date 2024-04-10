const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

const customerRoute = require('./routes/Customer');
const managerRoute = require('./routes/Manager of Insurance');
const agentRoute = require('./routes/Insurance Agent');
const accountantRoute = require('./routes/Accountant');
const hrRoute = require('./routes/HR Department');
const inspectorRoute = require('./routes/Damage Inspector');
const dbAdminRoute = require('./routes/Database Administrator');
const financeRoute = require('./routes/Finance Department');

app.use('/customer', customerRoute);
app.use('/manager', managerRoute);
app.use('/agent', agentRoute);
app.use('/accountant', accountantRoute);
app.use('/hr', hrRoute);
app.use('/inspector', inspectorRoute);
app.use('/dbadmin', dbAdminRoute);
app.use('/finance', financeRoute);


const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}`);
});