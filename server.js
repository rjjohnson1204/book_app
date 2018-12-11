'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.render('./pages/index');
});

app.get('/', (req, res) => {
  res.render('./pages/index');
});

app.post('/searches', (req, res) => {
  console.log('my request body:', req.body);
});
