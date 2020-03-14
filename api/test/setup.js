const mongoose = require('mongoose');

// Load models since we will not be instantiating our express server.
require('../models/user');
require('../models/participant');
require('../models/round');

const User = mongoose.model('User');

require('dotenv').config();
const { MONGO_SERVER, MONGO_DATABASE } = process.env;

const MONGO_TEST_DATABASE = `${MONGO_DATABASE}_test`;

process.env.MONGO_DATABASE = MONGO_TEST_DATABASE;

// beforeEach( async done => {
beforeAll( async done => {

    /*
        Create testing DB
    */
    const createDB = async () => {
        await clearDB();
        await userMockData();
        return done();
    }

    /*
        Loop through all collections and drop them.
    */
    const clearDB = () => {

        let removeCollections = [];
        for (var i in mongoose.connection.collections) {
            removeCollections.push( mongoose.connection.collections[i].deleteMany(function() {}) );
        }
        return Promise.all( removeCollections )

    }

    /*
        Create mock data to collections
    */

    // USER MOCK DATA
    const userMockData = async () => {

        // USER MOCK DATA
        const usersData = require('./mock/users.json')
        return new Promise( (resolve, reject) => {
            User.insertMany(usersData, (err, docs) => {
                if (err){ 
                    return console.error(err);
                    reject( null )
                } else {
                    resolve( true )
                }
            });
        })
        
    }

    mongoose.disconnect();
    mongoose.connect(
        `${MONGO_SERVER}/${MONGO_TEST_DATABASE}`,
        async err => {
            if (err) {
                throw err;
            }
            const create = await createDB();
            return create;
        }
    );
    const create = await createDB();
    return create;

});

afterEach( done => {
    return done();
});

afterAll( done => {
    mongoose.disconnect();
    return done()
})