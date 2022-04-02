const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreatedIndex: true,
    }).then((data) => {
        console.log(`mongodb connect with server: ${data.connection.host}`);
    });

};

module.exports = connectDatabase;