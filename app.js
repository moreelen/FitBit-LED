/* eslint-disable no-console, max-len, no-unused-vars, no-shadow */
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
// const childProcess = require('child_process');

const port = process.env.PORT || 8553;

const clientId = process.env.FITBIT_CLIENT_ID;
const secret = process.env.FITBIT_SECRET;

if (typeof clientId === 'undefined') {
  throw new Error('NO_FITBIT_CLIENT_ID');
}

if (typeof secret === 'undefined') {
  throw new Error('NO_FITBIT_SECRET');
}

const headerResponse = `${clientId}:${secret}`;


// Set up the express app
const app = express();

app.use(express.static('client'));

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup variables.
let redirectURL = null;

// Check auth call works.
app.get('/auth', (req, res) => {
  console.log('AUTH is hit');
  console.log('originalUrl', req.originalUrl); // '/admin/new'
  console.log('baseUrl', req.baseUrl); // '/admin'
  console.log('path', req.path); // '/new'
  return res.sendStatus(200);
});

// Server console
// app.use((req, res, next) => {
//     console.log('%s request to %s from %s', req.method, req.path, req.ip);
//     next();
// });

// Token request - gets URL which we need to redirect the user to
// so they can input their username and login details.
app.get('/token', (req, res) => {
  const redirect_uri = `https://${req.hostname}/auth`; // eslint-disable-line camelcase
  console.log('redirect_uri', redirect_uri);
  const options = {
    method: 'POST',
    url: 'https://www.fitbit.com/oauth2/authorize',
    qs: {
      response_type: 'token',
      client_id: clientId,
      redirect_uri,
      scope: 'heartrate',
      // scope: 'activity nutrition heartrate location nutrition profile settings sleep social weight',
      expires_in: '604800',
    },
    headers: {
      Authorization: `Basic: ${headerResponse.toString(64)}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    // console.log(response);
    // console.log(response.headers.location);
    redirectURL = response.headers.location;
    console.log('redirectURL', redirectURL);
    // childProcess.exec(`open -a "Google Chrome" ${redirectURL}`);
    return res.redirect(redirectURL);
    // request({ method: 'GET', url: redirectURL }, (error, response, body) => {
    //   if (error) throw new Error(error);
    //   console.log('resp2', response);
    //   console.log('body', body);
    // });
  });
});

// Server
const server = app.listen(port, () => {
  console.log(`rosa final project is working on port ${port}`);
});

module.exports = server;
