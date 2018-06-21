'use strict';

const mongoose = require('mongoose');

// Define the schema
const adSchema = mongoose.Schema({
    name: String,
    sale: Boolean,
    price: Number,
    img: String,
    tags: Array
});

// Create the model
const Ad = mongoose.model( 'Ad', adSchema );

module.exports = Ad;