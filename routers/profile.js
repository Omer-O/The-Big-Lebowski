const express = require('express');
const router = express.Router(); //this is a METHOD that has 'get' and 'post'
//methods on it just like app.get/post in the index.js


we can pass all the get and post request to here: to make it more clean.

we will write it as followed:

router.route('/profile')
    .get((req,res) => {
        //all the get code in here including the callback functions.
    })

    .post((req,res) => {
        //all the post code in here including the callback functions.
    })

module.exports = router;
