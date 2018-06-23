const express = require('express');
const path = require('path');
const mysql= require('mysql');
const bodyParser = require('body-parser');
const mysqlCredentials = require('./mysqlCredentials.js');
const cronJob = require('cron');
const app = express();

//creating an access point to db
const db = mysql.createConnection(mysqlCredentials);

//Body parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//connect to static files
app.use( express.static(path.join(__dirname, 'client'))); 

//access to students
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

//creating a student in database
app.post('/create', function(req, res){
    let name = req.body.name;
    let grade = req.body.grade;
    let course = req.body.course;
    console.log(req.body);

        const data = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
        const inserts = ['students', 'name', 'course', 'grade', name, course, grade];
        const sql = mysql.format(data, inserts);
        db.query(sql, function(err, result){
            if (err) throw err;
            res.end();
        });
    });

//deleting a student in the database
app.delete('/delete', function(req, res){
    console.log('REQ BODY', req.body);
    let id = req.body.id; 
    const data = "DELETE FROM ?? WHERE ?? . ?? = ?";
    const inserts = ['students', 'students', 'id', id];
    const sql = mysql.format(data, inserts);
    console.log(sql);
    db.query(sql, function(err, results){
        if (err) throw err;
        res.end();
    })
});

// clean up database every week.
// cron.schedule('* 12 * * 1', function(){
//     console.log('running cron job');

//     const data = "INSERT INTO `students` (`id`, `name`, `grade`, `course`) VALUES (8946, 'Zoe', 100, 'Javascript'), (8949, 'Chris', 100, 'Javascript'), (8950, 'Katya', 48, 'Javascript'), (8951, 'Liz', 80, 'Javascript'), (8952, 'Saphire', 89, 'Art'), (8953, 'Rose', 78, 'Art'), (8954, 'Daniel', 100, 'Art'), (8955, 'Tori, 50, 'Art'), (8956, 'Niko', 100, 'Poetry), (8957, 'Richard', 65, 'Philosophy'), (8958, 'Myles', 97, 'Music'), (8959, 'Kiran', 30, 'Poetry'), (8960, 'Jamie', 70, 'PHP')";

//     db.query(data, function(err, result){
//             if (err) throw err;
//             });  
// });


const job1 = new cronJob.CronJob({
    cronTime: '* * 12 * * 1-5',
    onTick: function() {
        console.log('running cron job');

        const truncate = "TRUNCATE TABLE students";

        db.query(truncate, function(err){
            if(err) throw err;
        })

        const data = "INSERT INTO `students` (`id`, `name`, `grade`, `course`) VALUES (8946, 'Zoe', 100, 'Javascript'), (8949, 'Chris', 100, 'Javascript'), (8950, 'Katya', 48, 'Javascript'), (8951, 'Liz', 80, 'Javascript'), (8952, 'Saphire', 89, 'Art'), (8953, 'Rose', 78, 'Art'), (8954, 'Daniel', 100, 'Art'), (8956, 'Niko', 100, 'Poetry'), (8957, 'Richard', 65, 'Philosophy'), (8958, 'Myles', 97, 'Music'), (8959, 'Kiran', 30, 'Poetry'), (8960, 'Jamie', 70, 'PHP'), (8961, 'John', 100, 'Python'), ('8962', 'Dasie', 89, 'Science')";
        
        db.query(data, function(err, result){
            if (err) throw err;
            });  
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });
  
job1.start(); 
  
app.listen(3000, function(){
    console.log("Listening on port:3000");
})

