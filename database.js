var MongoClient = require('mongodb').MongoClient;
var dbConnection = 'mongodb+srv://olavikurki:2nnaVaaht9@olavisreminders.wdq1n.mongodb.net/Reminders?retryWrites=true&w=majority';


class Database {
    static deleteReminder(reminderId) {
        var result = false
        MongoClient.connect(dbConnection)
            .then(result => {
                var db = client.db('Reminders');
                db.collection('Reminder')
                    .find({ _id: reminderId })
                    .toArray()
                    .then(reminder => {
                        console.log("reminder", reminder)
                        if (!reminder) {
                            client.close();
                            return false
                        }
                        db.collection('Reminder').deleteOne({ _id: reminderId }, result => {
                            client.close();
                            result = true
                            console.log("delete one result", result)
                            return true
                        });
                    })
            })
        console.log("result", result)
        return result
    }
}

module.exports = Database