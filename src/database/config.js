const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.Db_Connection);
        console.log("DB conectada");

    } catch (error) {
        console.log(error);

    }
};

module.exports = {
    dbConnection
}