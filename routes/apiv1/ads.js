'use strict';

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');

const Ad = require( '../../models/Ad' );

/**
 * Get the ads paginated
 */
router.get('/', async (req, res, next) => {
    try {
        // Define variables
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
 * Get the tags
 */
router.get('/tags', async (req, res, next) => {
    try {
        const docs = await Ad.distinct('tags');
        res.json({success: true, data: docs});
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * Get the maximum price
 */
router.get('/max_price', async (req, res, next) => {
    try {
        const query = Ad.find();
        query.sort('-price');
        query.limit(1);
        query.select('price');

        const docs = await query.exec();
        res.json({success: true, data: docs});
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * Insert new ad
 */
router.post('/', [
    body('price').optional().isNumeric().withMessage('must be numeric'),
    body('sale').optional().isBoolean().withMessage('must be boolean'),
    body('tags').custom( value => { // check if the tags passed are correct
        return new Promise( (resolve, reject) => {
            Ad.distinct('tags', (err, tags) => {
                const tagsPassed = value.split(/,|\s/);
                tagsPassed.forEach(tag => {
                    if(tags.indexOf(tag) == -1) {
                        return reject(); // it found an incorrect tag
                    }
                });

                return resolve();
            })
        } ) 
    } ).withMessage('You have added incorrect tags.')
], async (req, res, next) => {
    try {
        // Send the validation result if error
        validationResult(req).throw();
        const data = req.body;

        // Convert tags passed to array before insert into database
        data.tags = data.tags.split(/,|\s/);
        const ad = new Ad(data);

        // Save the ad into database
        const doc = await ad.save();
        res.json({success:true, data: doc});
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * Update an ad by _id
 */
router.put('/:id', [
    body('price').optional().isNumeric().withMessage('must be numeric'),
    body('sale').optional().isBoolean().withMessage('must be boolean'),
    body('tags').custom( value => { // check if the tags passed are correct
        return new Promise( (resolve, reject) => {
            Ad.distinct('tags', (err, tags) => {
                const tagsPassed = value.split(/,|\s/);
                tagsPassed.forEach(tag => {
                    if(tags.indexOf(tag) == -1) {
                        return reject(); // it found an incorrect tag
                    }
                });

                return resolve();
            })
        } ) 
    } ).withMessage('You have added incorrect tags.')
], async (req, res, next) => {
    try {
        validationResult(req).throw();
        const data = req.body;
        const _id = req.params.id;

        // Convert tags passed to array before insert into database
        data.tags = data.tags.split(/,|\s/);
        
        const adUpdated = await Ad.findByIdAndUpdate(_id, data, {
            new: true
        });

        res.json({success: true, data: adUpdated});
    } catch(err) {
        next(err);
        return;
    }
});

/**
 * Delete an ad by _id
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;

        await Ad.remove( {_id: _id} ).exec();

        res.json( { success: true } );
    } catch(err) {
        next(err);
        return;
    }
})

module.exports = router;