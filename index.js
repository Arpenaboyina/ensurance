const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rakesh04@',
    database: 'DBMS'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return; // Removed extra backtick here
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.set('mysqlConnection', connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

//const agentRoute = require('./routes/insurance Agent'); 
const managerRoute = require('./routes/manager');

//app.use('/agent', agentRoute);
app.use('/manager', managerRoute);

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}`);``
});
