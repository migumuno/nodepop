'use strict';

const express = require('express');
const router = express.Router();

const Ad = require( '../../models/Ad' );

/**
 * Get the ads paginated
 */
router.get('/', async (req, res, next) => {
    try {
        const name = req.query.name;
        const sale = req.query.sale;
        const tags = req.query.tags;
        const price = req.query.price;
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const fields = req.query.fields;

        const filter = {};

        // Define the page
        const limit = 12;
        const skip = page*limit;

        // Define filter for name, check if it contain the word...
        if( typeof(name) !== 'undefined' ) {
            filter.name = new RegExp('^' + name, "i");
        }

        // Define filter for sale, check booolean
        if( typeof(sale) !== 'undefined' ) {
            filter.sale = sale;
        }

        // Define filter for tags
        if( typeof(tags) !== 'undefined' ) {
            // Convert tags string into array
            filter.tags = {$in: tags.split(/,|\s/)};
        }

        // Define filter for price
        if( typeof(price) !== 'undefined' ) {
            let priceArray = price.split('-');
            priceArray = priceArray.map(parseFloat);

            if( priceArray.length == 1 ) {
                filter.price = priceArray[0];
            } else if( !isNaN(priceArray[0]) && !isNaN(priceArray[1]) ) {
                filter.price = {$gte: priceArray[0], $lte: priceArray[1]};
            } else if( !isNaN(priceArray[0]) ) {
                filter.price = {$gte: priceArray[0]};
            } else if( !isNaN(priceArray[1]) ) {
                filter.price = {$lte: priceArray[1]};
            } 
        }

        // Get the docs
        const docs = await Ad.list(filter, skip, limit, sort, fields);
        res.json({success: true, data: docs});
    } catch(err) {
        next(err);
        return;
    };
});

/**
 * 
 */

module.exports = router;