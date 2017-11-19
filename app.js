/* eslint-disable no-console, max-len, no-unused-vars, no-shadow, camelcase, consistent-return */
const express = require('express');
const logger = require('morgan');
const globalLog = require('global-request-logger');
const bodyParser = require('body-parser');
const request = require('request');
const util = require('util');
// const childProcess = require('child_process');

const port = process.env.PORT || 8553;

const clientId = process.env.FITBIT_CLIENT_ID;
const secret = process.env.FITBIT_SECRET;

console.log('clientId', clientId);
console.log('secret', secret);

if (typeof clientId === 'undefined') {
  throw new Error('NO_FITBIT_CLIENT_ID');
}

if (typeof secret === 'undefined') {
  throw new Error('NO_FITBIT_SECRET');
}

const creds = `${clientId}:${secret}`;
const buff = Buffer.from(creds);
const headerResponse = buff.toString('base64');


// Set up the express app
const app = express();

app.use(express.static('client'));

// Log requests to the console.
app.use(logger('dev'));

// Log OUTGOING
globalLog.initialize();
globalLog.on('success', (request, response) => {
  console.log('SUCCESS');
  console.log('Request', request);
  console.log('Response', response);
});

globalLog.on('error', (request, response) => {
  console.log('ERROR');
  console.log('Request', request);
  console.log('Response', response);
});

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup variables.
let redirectURL = null;

function refreshToken(req, res) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://api.fitbit.com/oauth2/token',
      qs: {
        grant_type: 'refresh_token',
        refresh_token: app.get('refresh_token'),
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${headerResponse}`,
      },
    };
    request(options, (error, response, body) => {
      if (error) return res.status(500).send(error);
      const FB_response = JSON.parse(body);
      console.log('AUTH response', FB_response);
      const FB_Errors = FB_response.errors;
      if (FB_Errors && FB_Errors.length) {
        FB_Errors.forEach((err) => {
          console.log('Error: ', err.message);
        });
        reject(new Error('FB_Errors'));
      }
      app.set('access_token', FB_response.access_token);
      app.set('refresh_token', FB_response.refresh_token);
      resolve(FB_response);
    });
  });
}

function makeAPIRequest(req, res) {
  console.log('access token before api call', app.get('access_token'));
  const options = {
    method: 'GET',
    url: `https://api.fitbit.com/1/user/${app.get('user_id')}/activities/heart/date/today/1d.json`,
    qs: {
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${app.get('access_token')}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) return res.status(500).send(error);
    const refreshNeeded = JSON.parse(body)
      .errors.some(err => err.errorType === 'expired_token');

    if (refreshNeeded) {
      refreshToken(req, res)
        .then(() => {
          makeAPIRequest(req, res);
        })
        .catch(err => res.status(200).send(err));
    }
    console.log('Final Result: ', body);
    return res.status(200).json(body);
  });
}

// Check auth call works.
app.get('/auth', (req, res) => {
  console.log('AUTH is hit');
  console.log('clientId', clientId);
  console.log('redirect_uri', app.get('redirect_uri'));
  console.log('code', req.query.code);
  const options = {
    method: 'POST',
    url: 'https://api.fitbit.com/oauth2/token',
    qs: {
      client_id: clientId,
      grant_type: 'authorization_code',
      redirect_uri: app.get('redirect_uri'),
      code: req.query.code,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${headerResponse}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) return res.status(500).send(error);
    const FB_response = JSON.parse(body);
    console.log('AUTH response', FB_response);
    const FB_Errors = FB_response.errors;
    if (FB_Errors && FB_Errors.length) {
      FB_Errors.forEach((err) => {
        console.log('Error: ', err.message);
      });
      return res.status(500).send(FB_Errors);
    }

    // You'd likely us 'fs' to read/write from disk (See bottom of file)
    app.set('access_token', FB_response.access_token);
    app.set('refresh_token', FB_response.refresh_token);
    app.set('user_id', FB_response.user_id);

    makeAPIRequest(req, res);
  });
});

// Token request - gets URL which we need to redirect the user to
// so they can input their username and login details.
app.get('/token', (req, res) => {
  const redirect_uri = `https://${req.hostname}/auth`; // eslint-disable-line camelcase
  app.set('redirect_uri', redirect_uri);
  console.log('redirect_uri', redirect_uri);
  const options = {
    method: 'POST',
    url: 'https://www.fitbit.com/oauth2/authorize',
    qs: {
      response_type: 'code',
      client_id: clientId,
      redirect_uri,
      scope: 'heartrate',
      // scope: 'activity nutrition heartrate location nutrition profile settings sleep social weight',
      expires_in: '604800',
    },
    headers: {
      Authorization: `Basic ${headerResponse}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) return res.status(500).send(error);
    console.log('token body', body);
    // console.log(response.headers.location);
    redirectURL = response.headers.location;
    console.log('redirectURL', redirectURL);
    // childProcess.exec(`open -a "Google Chrome" ${redirectURL}`);
    return res.redirect(redirectURL);
  });
});

// Server
const server = app.listen(port, () => {
  console.log(`rosa final project is working on port ${port}`);
});

module.exports = server;

// SAVING TOKENs
// write(token.json, (err, data) => {
//  Do something with token
// });

// RETRIEVING TOKENS
// read(token.json, (err, data) => {
//  Do something with token
// });
