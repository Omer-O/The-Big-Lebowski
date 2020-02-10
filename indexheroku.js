
///////////////// require section /////////////////////////////
const express = require('express');
const app = express();
exports.app = app;//we do this so we can import the file to index.test.js
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./utils/db');
const bc = require('./utils/bc');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
// const { requireNoSignature, fn } = require('./middleware')
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(cookieSession({ //this code create a session with the cookie.
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(express.static('./public'));
// const profileRouter = require('./routers/profile');
// app.use(profileRouter);
app.use(bodyParser.urlencoded({extended: false}));
app.use(csurf());
app.use((req, res, next) => {
res.locals.csrfToken = req.csrfToken();
     // res.setHeader('X-FRAME-OPTIONS', 'DENY');
    next();
});
///////////////// regestration page /////////////////////////////
app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
        siteName: "The DUDE Day",
    });
});
///registration post request:
app.post('/registration', (req,res) => {
        bc.hashPassword(req.body.password
        ).then(hashPass => {
            db.addUser(
            req.body.first,
            req.body.last,
            req.body.email,
            hashPass
        ).then(pass => {
            req.session.userId = pass.rows[0].id;
            req.session.first = pass.rows[0].first;
            req.session.last = pass.rows[0].last;
            req.session.email = pass.rows[0].email;
            res.redirect('/profile');
        }).catch(error => {
            console.log(error);
        });
    });
});
///////////////// profile page /////////////////////////////
app.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'main',
        siteName: "The DUDE Day"
    });
});
//post request:
app.post('/profile', (req, res) => {
    db.addUserProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.userId
    ).then(rslt => {
        req.session.userId = rslt.rows[0].id;
        res.redirect('/petition');
    }).catch(error => {
        console.log(error);
    });
});
///////////////// petition page /////////////////////////////
app.get('/petition', (req, res) => {
    if (req.session.sign) {
        res.redirect('petition/signed');
    } else {
        res.render('petition', {
            layout: 'main',
            siteName: "The DUDE Day",
        });
    }
});
//post request:
app.post('/petition', (req, res) => {
    db.addSignature(
        req.body.signature,
        req.session.userId
    ).then(rslt => {
        req.session.signId = rslt.rows[0].id;
        res.redirect('/petition/signed');
        }).catch(error => {
        console.log(error);
        });
});

///////////////// signed page including img and link to signers page /////////////////////////////
app.get('/petition/signed', (req, res) => {
    //console.log('this is the res.body of signed:', req.session);
    db.getSignature(req.session.userId)
    .then(rslt => {
            //console.log('this is the getSignature results:', rslt);
        db.getUserSignedCount().then(results => {
                //console.log('this is getUserSignedCount results:', results);
                res.render('signed', {
                    layout: 'main',
                    siteName: 'The DUDE Day',
                    signImg: rslt.rows[0].signature,
                    count: results.rows[0].count
                });
        }).catch(err => {
        console.log(err);
        });
    });
});
///////////////// Sigeners page /////////////////////////////
app.get('/petition/signers', (req, res) => {
    db.signers().then(name => {
        console.log('loging name after singers:', name);
         res.render('signers', {
             layout: 'main',
             siteName: 'The DUDE Day',
             signers: name.rows
         });
    }).catch(err => {
     console.log(err);
    });
});
app.get('petition/signers/:city', (req, res) => {
    const city = req.body.city;
        db.getSignersByCity(city).then(rslt => {
         //console.log('results for getSignersByCity:', rslt);
         res.render('city', {
             layout: 'main',
             siteName: 'The DUDE Day',
             signers: rslt.rows
         });
    }).catch(err => {
     console.log(err);
    });
});
///////////////// edit-profile page /////////////////////////////
// app.get('/edit-profile', (req, res) => {
//
// })
// app.post('/edit-profile', (req, res) => {
//
// }).catch(err => {
//     console.log(err);
// });
///////////////// login page /////////////////////////////
app.get("/login", (req, res) => {
    res.render("login", {
     layout: "main",
     siteName: "The DUDE Day",
    });
});
//login POST:
app.post('/login', (req,res) => {console.log(req.body);
     db.user(req.body.email
         ).then(newPass => {
         //    console.log('this is newPass :', newPass);
             bc.checkPassword(req.body.password, newPass.rows[0].password
         ).then(matchPass => {
             console.log('this is matchPass :', matchPass);
             if (matchPass) {
                 console.log('this is check for newpass:', newPass.rows[0]);
                 req.session.userId = newPass.rows[0].user_id;
                 res.redirect('/petition/signed');
             } else {
                 throw new Error("wrong password");
                 res.redirect('/login');
             }
         }).catch(error => {
             console.log(error);
             //need to pass a massage
         });
    });
});
///////////////// delete-account page ///////////////////////
app.post('/delete-account', (req, res) => {
    db.deleteAccount(req.session.userId
        ).then(rslt => {
         req.session = null;
         res.redirect('/registration');
    }).catch(err => {
     console.log(err);
    });
});
///////////////// delete-signature page ///////////////////////
app.post('/delete-signature', (req, res) => {
    db.deleteSignature(req.session.sign
        ).then(rslt => {
         console.log('this is delete rslt:', rslt);
         delete req.session.sign_id;
         res.redirect('/petition');
    }).catch(err => {
     console.log(err);
    });
});
///////////////// logOut page /////////////////////////////
app.get('/logout', (req,res) => { //erase the cookie when logout.
    req.session = null;
    res.redirect('/login');
});

app.get('/', (req,res) => {
    res.redirect('/registration');
});

///////////////// 404 massage /////////////////////////////
app.get("*", (req, res) => {
    res.render('404', {
     layout: 'main',
     siteName: 'The DUDE Day',
    });
});


if (require.main == module) {
    // app.listen(8080, () => console.log('Im listening'));
    //HEROKU:
    app.listen(process.env.PORT || 8080, () => console.log('Im listening'));
}
