const mongoose = require('mongoose');

const config = require('../../config/database');

function clearDB(collection,done,isLogged) {
    return mongoose.connection.dropCollection(collection, () => {
        if(isLogged) console.log('Cleared '+collection+' DB.');
        if(done) done();
    });
}


before(function (done) {
    this.timeout(10000);
    mongoose.connect(config.database_url_test);

    mongoose.connection.once('open',async (err) => {
        if (err) throw (err);
        else {
            console.log('Connected to DB');
            await clearDB('users');
            clearDB('teams',done);
        }
    })
})

after(async function () {
    this.timeout(10000);
    await clearDB('users');
    await clearDB('teams');
    mongoose.disconnect(() => {
        console.log('Successfuly disconnected.');
    });
})

module.exports=clearDB;