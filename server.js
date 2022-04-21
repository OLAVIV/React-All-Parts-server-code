var express = require('express');
var cors = require('cors')
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var dbConnection = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';
var database = require('./database')

var app = express();
app.use(express.json())
app.use(cors())

app.delete("/api/reminders/:id", function (req, res) {
  console.log(req.params)
  var reminderId = parseInt(req.params.id, 0)
  console.log(reminderId)
  database.deleteReminder(reminderId,
    (reminder) => {
      res.status(200)
        .header({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        .send(JSON.stringify(reminder));
    },
    () => {
      res.status(406).send("Reminder doesn't exist!");
    })
})

app.get("/api/reminders/", function (req, res) {
  database.getReminders(
    (response) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.write(JSON.stringify(response));
      res.end();
    },
    (errorMessage) => {
      res.status(400)
        .send(errorMessage);
    })
})

app.post("/api/reminders", function (req, res) {
  console.log(req.body.name + " " + req.body.timestamp)
  if (!req.body.name || !req.body.timestamp) {
    res.status(406).send("Invalid name or timestamp");
    return
  }
  database.addReminder(req.body.name, req.body.timestamp,
    (newReminder) => {
      res.status(200)
        .header({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        .send(JSON.stringify(newReminder));
    },
    (errorMessage) => {
      res.status(400)
        .send(errorMessage);
    }
  )
});



var server = app.listen(process.env.PORT || 4000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})