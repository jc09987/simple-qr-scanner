var express = require("express");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

require('dotenv').config();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

var host = process.env.HOST;
var port = process.env.PORT || 5000;

var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE,
};

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createPool(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

app.get('/', function(req, res) {
    connection.query('SELECT * from users', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        res.send([rows]);
    });
});

app.get("/api/users/:id", (req, res) => {
    connection.query(`SELECT * from users WHERE id = ${parseInt(req.params.id)}`, function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        res.send(rows);
    });
  });

app.post("/api/users/", (req, res) => {
    connection.query(`UPDATE users SET isActive = true WHERE id = ${parseInt(req.body.id)}`, function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        res.send(rows);
    });
});

app.listen(port, host, function() {
    console.log("Listening on " + port);
});