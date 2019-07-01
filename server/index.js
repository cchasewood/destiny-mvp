require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch')

const apiFuncs = require('../api/destinyRoutes.js')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const db = require('../database/index.js')

const app = express();
app.use(cors());
app.use(express.static(__dirname+'/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/seed', (req, res) => {
  console.log('request at server, heading to database')
  database('guardians').limit(1).then(info => res.status(200).send(info));
})

app.post('/search', (req, res) => {
  console.log('retrieving ' + req.body.displayName + '\'s profile');
  database('guardians').where({ displayName: req.body.displayName }).limit(1)
    .then(info => {
      if(info.length ===1) res.status(200).send(info);
      else apiFuncs.buildGuardian(req.body.displayName, (data) => database('guardians').insert(data).then(info => res.status(200).send(info)))
    })
})

app.post('/items', (req, res) => {
  console.log('retrieving ' + req.body.displayName + '\'s items');
  apiFuncs.buildItems(req.body.displayName, data => res.status(200).send(data));
})

app.get('/signin', (req, res) => {
  fetch('https://www.bungie.net/en/oauth/authorize?client_id=12345&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4')
    .then(res => res.json())
    .then(data =>  res.status(200).send(data));
})
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});