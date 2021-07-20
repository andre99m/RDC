const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var express = require('express');
var Order = require('../models/order');
var { Sequelize, Op } = require('sequelize');
var router = express.Router();
var path = require('path');
const { route } = require('.');
const { isLoggedIn } = require('../config/isLoggedIn');
const { authRole } = require('../config/authRole');
const CREDENTIALS = path.join(__dirname, 'credentials.json');
const TOKEN = path.join(__dirname, 'token.json');

router.get('/:id', authRole('assistente'), isLoggedIn, function(req,res,next){
  if (/@gmail\.com$/.test(req.user.dataValues.email)) {
    // This is a gmail id.

  Order.findByPk(req.params.id).then(risposta =>{


  
  console.log(req.params.id);
  // If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = TOKEN;

// Load client secrets from a local file.
fs.readFile(CREDENTIALS, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
    
  });
  
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  var now = new Date();
  var msNow = now.getTime();
  var timeMax = new Date(msNow + 60 * 60 * 1000); //  "now" plus one hour
  var timeMin = new Date(msNow); //  "now" minus one hour

  var event = {
    'summary': 'Nuova Richiesta',
    'location': risposta.dataValues.indirizzo+", "+req.user.dataValues.citta,
    'description': "da: "+risposta.dataValues.emailuser,
    'start': {
      'dateTime': timeMin,
      'timeZone': 'Europe/Rome',
    },
    'end': {
      'dateTime': timeMax,
      'timeZone': 'Europe/Rome',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=1'
    ],
    "attendees": [
      {
        "email": req.user.dataValues.email
      }
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created\n');
    console.log(event.htmlLink);
    res.redirect('/user/profile');
  });
  
}
});
}
else {
  res.redirect('/user/profile');
}
})

module.exports = router;
