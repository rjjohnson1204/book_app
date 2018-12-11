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

// Book model
function Book(item) {
  this.thumbnail = item.imageLinks.thumbnail;
  this.title = item.volumeInfo.title;
  this.author = item.volumeInfo.authors.split(', ');
  this.description = item.volumeInfo.description;
}

app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.render('./pages/index');
});

app.get('/', (req, res) => {
  res.render('./pages/index');
});

app.post('/searches', getResults);

function getResults(req, res) {
  console.log('line 40: ', req.body);
  let input = req.body;
  console.log('line 42: ', input);
  let results = showResults(input);
  // res.render('./searches/show', {results: results});
  console.log('line 45: ', results);
}

function showResults(input) {
  console.log('line 49: ', input);
  console.log('line 49: ', input.search_field);
  console.log('line 49: ', input.searchby);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${input.search_field}+${input.searchby}:${input.search_field}`;
  return superagent.get(url).then(data => {
    console.log('line 54: ', data.body);
    const results = data.body.items.map(item => {
      const book = new Book(item);
      return book;
    });
    console.log('line 59: ', results);
    return results;
  });
}
