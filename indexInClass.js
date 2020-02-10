const express = require('express');
const app = express();
const hb = require('express-handlebars');
const db = require('./utils/db');
console.log(db);
var cookieSession = require('cookie-session');


app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));

app.use bodyparser here

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.get('/petition', (req, res) => { //this is a route - a page in local host
    //the '/' - is the actual page.
    res.render('petition', {
        layout: 'main'
    })
})

app.post('/petition')
//1#  we send data from the front to the back end - !send! the name and signature to the server.
//2# !insert! the data to the data-base and when the info is in the database
//3# the db store the info we sent him. - here we need to put something into the cookie that the
//user sign the petition.
//4# we will than !redirect! to say thank u for submiting the info.

app.get('petition/signers', (req, res) => {
    rese.render('signers', {
        layout: 'main'
    })
})

app.listen(8080, () => console.log('Im listening'));

// app.post('./add-city', (req, res) => {
//     // in the project the values will come from values the user entres in the input field.
//     // we will have to figure how to get access to those values in our server.
//     db.addCity('Berlin', 'DE').then(() => {
//         ers.redirect('/thank-you');
//     })
// })

// cookies will assist us to keep the signature and render it also
// on the 'thank u page' (it is  a different page).
//we use cookies as a stored informtion - so when the user sign the petition.

//we will need to restore a reference from the database (the id) in the cookies - otherwise
//it is too big to store the url in the cookies.

//in the past we took the 'cookie-parser' - but he does not have a security on it.
//for this project we will use cookie session - it creates 2 cookies:
var cookieSession = require('cookie-session'); //its installed already in the pkg.json

app.use(cookieSession({ //we will place it after the body.parser in the code.
    secret: `I'm always angry.`, //this is the information will be dispalayes
    maxAge: 1000 * 60 * 60 * 24 * 14 //this is the time the cookie will stay - 14 days in this case.
}));
//1st cookie will hold the id and information.
{
    signatureId: 1
}
//2nd cookie will be a copy that is secured/encripted.
{
    bskjfhskjdfhnsklfjshkjs: 'skjfghskjfhskdfj'
}

//this is how we can test it:

var cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));


app.get('cookie-test', (req, res) => {
    //session property comes from the middleware function we just pasted up above.
    //req. session is an OBJECT!
    req.session.cookie = true;
    //here we adding a property to our cookie thats called "cookie" and
    //the vlaue of cookie is true.
    //now we can check it with console.log();
    console.log('checking to see what in my cookie', req.session);//we will get
    //in the terminal { cookie: true }
    //that means that every single route in my server (app.get and app.post)
    //will have this
})
