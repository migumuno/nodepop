'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', (err) => {
    console.error('mongodb connection error', err)
});
conn.once('open', () => {
    console.info( 'Connected to MongoDB on', mongoose.connection.name )
});

mongoose.connect( 'mongodb://localhost/nodepop' );

module.exports = conn;