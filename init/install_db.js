'use strict';

// Create de database connection
const conn = require('../lib/connectMongoose');

// Declare de Ad model
const Ad = require('../models/Ad');

// Start the process
conn.once('open', async () => {
    try {
        // Get the Ads JSON
        const data = require('./ads.json');
        
        // Delete all the documents
        await Ad.deleteMany({}).catch(err => {
            throw new Error(err);
        });
        console.info('Removed all the data from database.');

        // Insert documents from JSON
        await Ad.insertMany(data).catch(err => {
            throw new Error(err);
        });
        console.info('Inserted all the data into database.');

        conn.close();
        console.info('Connection with database closed.');
    } catch(err) {
        console.error('Se ha producido un error en la ejecución del script', err);
        
        conn.close();
        console.info('Connection with database closed.');
    }
});