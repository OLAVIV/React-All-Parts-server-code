// import { MongoClient } from 'mongodb'
var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
var url = 'mongodb+srv://olavikurki:Password@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';
console.log(process.argv)
if (process.argv.length == 2) {
    MongoClient.connect(url, function (err, client) {
        var db = client.db('Reminders');
        db.collection('Reminder')
            .find()
            .toArray((err, doc)=> {
                console.log(doc);
            }) 
    });
}
else if (process.argv.length == 4) {
    console.log("adding a reminder " + process.argv[2] + " " + process.argv[3] + " ")
    MongoClient.connect(url, function (err, client) {
        var db = client.db('Reminders');
        db.collection('Reminder').insertOne({
            name: process.argv[2],
            timestamp: process.argv[3]
        });
    });
}
