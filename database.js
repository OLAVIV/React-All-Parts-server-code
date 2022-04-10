var MongoClient = require('mongodb').MongoClient;
var dbConnection = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';


class Database {
    static DeleteReminder(reminderId) {
        MongoClient.connect(dbConnection, function (err, client) {
            var db = client.db('Reminders');
            db.collection('Reminder')
                .find({ _id: reminderId })
                .toArray((err, reminder) => {
                    console.log(err)
                    console.log(reminder)
                    if (!reminder) {
                        client.close();
                        return false
                    }
                    db.collection('Reminder').deleteOne({ _id: reminderId }, result => {
                        client.close();
                        return true
                    });
                })
        })
    }
}

module.exports = Database