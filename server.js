var express = require('express');
var cors = require('cors')
var app = express();
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var dbConnection = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';

// let data = {
//   "reminders": [
//     {
//       "name": "Buy some eggs",
//       "timestamp": "2021-11-10T13:00:00.141Z",
//       "id": 1
//     },
//     {
//       "name": "Make an omelette",
//       "timestamp": "2021-11-11T08:00:00.141Z",
//       "id": 2
//     },
//     {
//       "name": "Wash dishes",
//       "timestamp": "2021-11-11T09:00:00.000Z",
//       "id": 3
//     },
//     {
//       "name": "Buy more eggs",
//       "timestamp": "2021-11-11T13:00:00.000Z",
//       "id": 4
//     }
//   ]
// }

app.use(express.json())
app.use(cors())

// app.get("/api/reminders/:id", function (req, res) {
//   const reminder = data.reminders.find(r => r.id == req.params.id)
//   if (!reminder) {
//     res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
//     res.end();
//     return
//   }
//   res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
//   res.write(JSON.stringify(reminder));
//   res.end();
// })


app.get("/api/reminders/:id", function (req, res) {
  const reminder = data.reminders.find(r => r.id == req.params.id)
  if (!reminder) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end();
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.write(JSON.stringify(reminder));
  res.end();
})

app.delete("/api/reminders/:id", function (req, res) {
  const reminder = data.reminders.find(r => r.id == req.params.id)
  if (!reminder) {
    res.status(404).send("Not Found");
    return
  }
  data = { reminders: data.reminders.filter(r => r.id != req.params.id) }
  res.status(200).header({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }).send({});
})

app.get("/api/reminders/", function (req, res) {
  var data = []
  MongoClient.connect(dbConnection, function (err, client) {
    var db = client.db('Reminders');
    db.collection('Reminder')
      .find()
      .toArray((err, result) => {
        data = result
        console.log(result)
      })
  });
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  var reminders = {
    reminders: data
  }
  res.write(JSON.stringify(reminders));
  res.end();
})



app.post("/api/reminders", function (req, res) {
  console.log(req.body.name + " " + req.body.timestamp)
  if (!req.body.name || !req.body.timestamp) {
    res.status(406).send("Invalid name or timestamp");
    return
  }
  // if (data.reminders.find(r => r.name == req.body.name)) {
  //   res.status(400).send("Same reminder already exists!");
  //   return
  // }
  var found = false
  MongoClient.connect(dbConnection, function (err, client) {
    var db = client.db('Reminders');
    db.collection('Reminder')
      .findOne({ name: req.body.name })
      .toArray((err, result) => {
        if (!err) {
          found = true
        }
      })
  });
  if (found) {
    res.status(400).send("Same reminder already exists!");
    return
  }
  let newId = Math.trunc(Math.random() * 1000000)
  let newReminder = { _id: newId, name: req.body.name, timestamp: req.body.timestamp }
  MongoClient.connect(dbConnection, function (err, client) {
    var db = client.db('Reminders');
    db.collection('Reminder').insertOne(
      newReminder
    );
    client.close();
  });
  res.status(200).header({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }).send(JSON.stringify(newReminder));
})

var server = app.listen(process.env.PORT || 4000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})