const { database, vouchDatabase } = require('./config.json');
const firebase = require('firebase');
require('firebase/database');

firebase.initializeApp({
    apiKey: database.apiKey,
    projectId: database.projectID,
    databaseURL: database.URL,
});

const vouch = firebase.initializeApp({
    apiKey: vouchDatabase.apiKey,
    projectId: vouchDatabase.projectID,
    databaseURL: vouchDatabase.URL,
}, 'secondary');

module.exports = {
    DB: firebase.database(),
    VDB: vouch.database(),
};