// 
// module.exports {//here we can import as many functions we have in out code.
//     requireNoSignature,
//     fn
// }
// ////////after we export the function to the index.js we can apply like this:
//
// app.get('/petition', requireNoSignature, (req, res) => {
//     if (req.session.signature) {
//         res.render('petition/signed');
//     } else {
//         res.render('petition', {
//             layout: 'main',
//             siteName: "The DUDE Day",
//             // first: req.session.first, LIVDOK ET HADAF
//             // last: req.session.last
//         });
//     }
// });



function requireNoSignature (req, res, next) {
    if (req.session.signatureId) {
        res.redirect('patition/signed');
    } else {
        next();
    }
}

function fn() {
    console.log('fn loged');
}
