var MongoClient = require('mongodb').MongoClient;
var dbConnection = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';


class Database {
    static deleteReminder(reminderId) {
        var result = false
        MongoClient.connect(dbConnection, function (err, client) {
            var db = client.db('Reminders');
            db.collection('Reminder')
                .find({ _id: reminderId })
                .toArray((err, reminder) => {
                    console.log("err", err)
                    console.log("reminder", reminder)
                    if (!reminder) {
                        client.close();
                        return
                    }
                    db.collection('Reminder').deleteOne({ _id: reminderId }, result => {
                        client.close();
                        result = true
                        console.log("delete one result", result)
                        return
                    });
                })
        })
        console.log("result", result)
    }
}

module.exports = Database