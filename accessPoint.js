const express = require('express');
const path = require('path');
const mysql= require('mysql');
const mysqlCredentials = require('./mysqlCredentials.js');
const app = express();

//creating an access point to db
const db = mysql.createConnection(mysqlCredentials);

//static files
app.use( express.static(path.join(__dirname, 'html')));

//access to the user
app.get('/users', function(req, res){
    db.connect(function(){
        db.query('SELECT * FROM students', function(error, rows, fields){
            const output = {
                success: true,
                data: rows
            }
            const json_output = JSON.stringify(output);
            //res.send closes connection
            res.send(json_output);
        })
    })
});

app.listen(3000, function(){
    console.log("Listening on port:3000");
})

