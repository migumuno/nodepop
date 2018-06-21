'use strict';

const express = require('express');
const router = express.Router();

const Ad = require( '../../models/Ad' );

/**
 * Get the ads
 */
router.get('/', async (req, res, next) => {
    Ad.find().exec( (err, docs) => {
        if( err ) {
            next(err);
            return;
        }

        res.json({success: true, data: docs});
    } );
});

/**
 * 
 */

module.exports = router;