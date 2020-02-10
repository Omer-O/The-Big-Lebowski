
//we need to require the supertest application from the
//json file of the project:

const supertest = require('supertest');
const { app } = require('./index');
//here we require the fake cookie-session - from the __mocks directory.
cost cookieSession = require('cookie-session');

test('GET/ home returns an h1 as respons', () => {
    //now we need to invoke the supertest and pass it the 'app'
    //as we do with the index.js
    return supertest(app).get('/home')// supertest returns a promise.
    //and we pass the promise to the .then() function
        .then(rslt => {//'rslt' is the respons we get from the server
            console.log('rslt:', rslt);//this will print the rslt after the test was running on the server.
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('<h1>Hello Home</h1>');
            expect(res.headers['content-type']).toContain('text/html');//to toContain() - this method will
            //make sure that the 'text/html' is contained inside.

        });
});

/////second test.    the .only will run only the test that marked.

test.only('GET/ home with no cookies causes me to be redirected', () => {
    return supertest(app).get('/home')
        .then(res => {
            //here we want to check if we will be redirected.
            console.log('location header:', res.headers.location);//this will give us the
            //route that we are located to. after we got the info we can test it down
            expect(res.statusCode).toBe(302); //302 is the redirect statusCode
            expect(res.headers.location).toBe('/registration');
        });
});
