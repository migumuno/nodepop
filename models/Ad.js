'use strict';

const mongoose = require('mongoose');

// Define the schema
const adSchema = mongoose.Schema({
    name: { type: String, index: true },
    sale: { type: Boolean, index: true },
    price: { type: Number, index: true },
    img: String,
    tags: { type: [String], index: true }
});

/**
 * List the ads with filtered options
 * @param {object} filter 
 * @param {integer} skip 
 * @param {integer} limit 
 * @param {string} sort 
 * @param {string} fields 
 */
adSchema.statics.list = function(filter, skip, limit, sort, fields) {
    // Get the query
    const query = Ad.find(filter);
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);
    
    // Execute the query and return
    return query.exec();
};

// Create the model
const Ad = mongoose.model( 'Ad', adSchema );

module.exports = Ad;