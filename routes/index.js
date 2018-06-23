const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
      const name = req.query.name;
      const sale = req.query.sale;
      const tags = req.query.tags;
      const price = req.query.price;
      const page = parseInt(req.query.page);
      const sort = req.query.sort;
      const fields = req.query.fields;

      var filter = {};
      var data = {};

      // Define the page
      const limit = 12;
      const skip = page*limit;

      // Define filter for name, check if it contain the word...
      if( typeof(name) !== 'undefined' ) {
          filter.name = new RegExp('^' + name, "i");
          data.name = name;
      }

      // Define filter for sale, check booolean
      if( typeof(sale) !== 'undefined' ) {
          filter.sale = sale;
      }

      // Define filter for tags
      if( typeof(tags) !== 'undefined' ) {
          // Convert tags string into array
          filter.tags = {$in: tags.split(/,|\s/)};
          data.tags = tags.split(/,|\s/)
      } else {
        data.tags = [];
      }

      // Get max price
      const query = Ad.find();
      query.sort('-price');
      query.limit(1);
      query.select('price');
      const max_price = await query.exec();
      data.top_price = max_price[0].price;

      // Define filter for price
      if( typeof(price) !== 'undefined' ) {
          let priceArray = price.split('-');
          priceArray = priceArray.map(parseFloat);

          if( priceArray.length == 1 ) {
              filter.price = priceArray[0];
          } else if( !isNaN(priceArray[0]) && !isNaN(priceArray[1]) ) {
              filter.price = {$gte: priceArray[0], $lte: priceArray[1]};
              data.min_price = priceArray[0];
              data.max_price = priceArray[1];
          } else if( !isNaN(priceArray[0]) ) {
              filter.price = {$gte: priceArray[0]};
              data.min_price = priceArray[0];
              data.max_price = data.top_price;
          } else if( !isNaN(priceArray[1]) ) {
              filter.price = {$lte: priceArray[1]};
              data.max_price = priceArray[1];
              data.min_price = 0;
          } 
      }

      // Get the docs
      const docs = await Ad.list(filter, skip, limit, sort, fields);

      // Get the tags and define if checked
      const tags_docs = await Ad.distinct('tags');
      data.tags = tags_docs.map(function(tag){
        let obj = {};
        obj.key = tag;
        obj.checked = '';

        if(data.tags.indexOf(tag) != -1 ) {
          console.log('Si');
          obj.checked = 'checked';
        }
        return obj;
      });

     

      // Render page
      res.render('index', { 
        title: 'Nodepop',
        ads: docs,
        data: data
      });
  } catch(err) {
      next(err);
      return;
  };
});

module.exports = router;