require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const $ = require('jquery')

const apiFuncs = require('../api/destinyRoutes.js')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const app = express();
app.use(cors());
app.use(express.static(__dirname+'/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/seed', (req, res) => {
  console.log('request at server, heading to database')
  database('guardians').limit(1).then(info => res.status(200).send(info));
})

app.post('/search', async (req, res) => {
  console.log('retrieving ' + req.body.displayName + '\'s profile');
  database('guardians').where({ displayName: req.body.displayName }).limit(1)
    .then(info => {
      if(info.length ===1) res.status(200).send(info);
      else apiFuncs.buildGuardian(req.body.displayName, (data) => database('guardians').insert(data).then(info => res.status(200).send(info)))
    })
})
// app.get('/reviews', (req, res) => {
  // console.log('request at server, heading to database');
  // database('reviews').limit(8).then((reviews) => {
  	// res.status(200).send(reviews);
  // });
// });
// app.get('/review', (req, res) => {
  // console.log('request at server, heading to database');
  // database('reviews').where({ username: faker.name.findName() }).limit(20).then((review) => {
  	// res.status(200).send(review);
  // });
// });
// 
// app.get('*', renderPage);
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});