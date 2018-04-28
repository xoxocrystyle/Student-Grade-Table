const express = require('express');
const path = require('path');
const mysql= require('mysql');
const bodyParser = require('body-parser');
const mysqlCredentials = require('./mysqlCredentials.js');
const app = express();

//creating an access point to db
const db = mysql.createConnection(mysqlCredentials);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//static files
app.use( express.static(path.join(__dirname, 'html')));

//access to users
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

app.post('/create', function(req, res){
    console.log('we made it fam');
    console.log(req.body);
    let name = req.body.name;
    let grade = req.body.grade;
    let course = req.body.course;

        const data = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
        const inserts = ['students', 'name', 'course', 'grade', name, course, grade];
        const sql = mysql.format(data, inserts);
        console.log("this is the query in our create endpoint" , sql);
        db.query(sql, function(err, result){
            if (err) throw err;
            res.end();
        });
    });

app.listen(3000, function(){
    console.log("Listening on port:3000");
})

