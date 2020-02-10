
/////////////////////////index back up////////////////

/////  project at stage:
//     + petiotion signed
//     + redirect to thank u page.
//     + signature picture displayed.
//     + link to signers page.

///////////////// require section /////////////////////////////
const express = require('express');
const app = express();
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./utils/db');
const bc = require('./utils/bc');
const cookieSession = require('cookie-session');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));
app.use(cookieSession({ //this code create a session with the cookie.
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));


///////////////// regestration page /////////////////////////////
app.get('/registration', (req,res) => {
    console.log('GET /registration page');
    res.render('registration', {
        layout: 'main',
    })
});

///////////////// petition page /////////////////////////////
app.get('/petition', (req, res) => {
    res.render('home', {
        layout: 'main',
        siteName: "The DUDE Day"
    });
});

///////////////// petition post request /////////////////////////////
app.post('/petition', (req, res) => {
    db.addSignature(
        req.body.firstName, req.body.lastName, req.body.signature
    ).then(rslt => {
        const id = rslt.rows[0].id;
        req.session.id = id;
            // console.log(id);
            // console.log('resault :', rslt.rows[0]);
        res.redirect('/petition/signed');
    }).catch(error => {
        console.log(error);
    });
});

//req.session.userID = 3 - something with the login and password.

///////////////// signed page including img and link to signers page /////////////////////////////
app.get('/petition/signed', (req, res) => {
    db.getSignature(req.session.id).then(img => {
        res.render('signed', {
            layout: 'main',
            siteName: 'The DUDE Day',
            signImg: img.rows[0].signature,
            signed: req.session.id
        });
    })
});

///////////////// Sigeners page /////////////////////////////
app.get('/petition/signers', (req, res) => {
    db.getSigners().then(name => {
        res.render('signers', {
            layout: 'main',
            siteName: 'The DUDE Day',
            signerName: name.rows
        });
    });
});

///////////////// logOut page /////////////////////////////
app.get('/logout', (req,res) => { //erase the cookie when logout.
    req.session = null;
    res.redirect('/registration');
});

///////////////// 404 massage /////////////////////////////
app.get("*", (req, res) => {
    res.send(`
    <!doctype html>
    <title>The DUDE Day</title>
    <h1>DUDE NOT FOUND</h1>
    `);
});

app.listen(8080, () => console.log('Im listening'));
