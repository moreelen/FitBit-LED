const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8553
const request = require("request");
const childProcess = require('child_process');

const clientId = '22CKYF';
const secret = 'cb411d16a2e69e8d1481c69e8c7564dd';
const headerRespone = clientId + ':' + secret;


// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup variables.
var redirectURL = null;

// Check auth call works.
app.get('/auth', (res, req) => {
    console.log( 'AUTH is hit');
    console.log( res );
});

//Server console
app.use((req, res, next) => {
    console.log('%s request to %s from %s', req.method, req.path, req.ip);
    next();
});

//Server
const server = app.listen(port, () => {
    console.log(`rosa final project is working on port ${port}`);
});

// Token request - gets URL which we need to redirect the user to
// so they can input their username and login details.
app.get('/token', ( req, res) => {

    const options = { method: 'POST',
    url: 'https://www.fitbit.com/oauth2/authorize',
    qs:
    { response_type: 'token',
    client_id: '22CKYF',
    redirect_uri: '/auth',
    scope: 'heartrate',
    // scope: 'activity nutrition heartrate location nutrition profile settings sleep social weight',
    expires_in: '604800' },
    headers:
    { 'Authorization': 'Basic ' + headerRespone.toString(64) } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(response);
        //console.log(response.headers.location);
        redirectURL = response.headers.location;
        console.log(redirectURL);
        //childProcess.exec('open -a "Google Chrome" ' + redirectURL);
    });
});

module.exports = server;
