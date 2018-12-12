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

// Error handler
function handleError(err, res) {
  console.error('ERROR', err);
  res.render('./pages/error');
}

// Book model
function Book(item) {
  this.thumbnail = item.volumeInfo.imageLinks.thumbnail || 'https://via.placeholder.com/128x200.png?text=Image+Unavailable';
  this.title = item.volumeInfo.title || 'N/A';
  this.author = item.volumeInfo.authors || 'N/A';
  this.description = item.volumeInfo.description || 'N/A';
}

app.post('/searches', getResults);

function getResults(req, res) {
  let input = req.body;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${input.search_field}+${input.searchby}:${input.search_field}`;
  return superagent.get(url).then(data => {
    const results = data.body.items.map(item => {
      const book = new Book(item);
      return book;
    });
    console.log('line 50: ', results);
    return results;
  }).then(results => res.render('./pages/searches/show', {books: results})).catch(error => handleError(error));
}
