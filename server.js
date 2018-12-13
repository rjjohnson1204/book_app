'use strict';

// Adds dependencies
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Middleware (captures req/res and modifies)
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Sets the server side templating engine
app.set('view engine', 'ejs');

// Loads .env variables, starts up app and opens connection to DB
require('dotenv').config();
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Test route
app.get('/hello', (req, res) => {
  res.render('./pages/index');
});

// Error handler
function handleError(err, res) {
  console.error('ERROR', err);
  res.render('./pages/error', {error: 'Something went wrong! Please refresh your page.'});
}

// Route to main page of saved books
app.get('/', getBooks);

// Route to show book details
app.get('/books/:book_id', getDetails);

app.get('/add', showForm);
app.post('/add', addBook);

function getBooks(req, res) {
  let SQL = 'SELECT * from books;';

  return client.query(SQL).then(results => res.render('./pages/index', {results: results.rows})).catch(err => handleError(err, res));
}

function getDetails(req, res) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [req.params.book_id];
  console.log('getDetails values = ', values);

  return client.query(SQL, values).then(result => {
    return res.render('./pages/books/detail', {book: result.rows[0]});
  })
}

// Shows the form to add a book to database
function showForm(req, res) {
  res.render('./pages/addForm')
}

// Adds a book to the database
function addBook (req, res) {
  let {author, title, isbn, image_url, description, bookshelf} = req.body;
  let SQL = 'INSERT INTO books(author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [author, title, isbn, image_url, description, bookshelf];

  return client.query(SQL, values).then(res.redirect('/')).catch(err => handleError(err, res));
}

// Route to search page
app.get('/search', (req, res) => {
  res.render('./pages/searches/search');
});

// Book model
function Book(item) {
  this.thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x200.png?text=Image+Unavailable';
  this.title = item.volumeInfo.title || 'N/A';
  this.author = item.volumeInfo.authors || 'N/A';
  this.isbn = item.volumeInfo.industryIdentifiers[0].identifier || 'N/A';
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
    // console.log('line 50: ', results);
    return results;
  }).then(results => res.render('./pages/searches/show', {books: results})).catch(error => handleError(error, res));
}

// jQuery events to load form on search results
// $('.selectBook').on('click', (event) => {
//   let id = event.target.value;
//   console.log('value: ', id);
//   if ($(event.target.is(':hidden'))) {
//     $(`#${id}`).slideDown();
//     $(`.selectBook[value='${id}']`).text('Cancel');
//   } else {
//     $(`#${id}`).slideUp();
//     $(`.selectBook[value='${id}']`).text('Select Book');
//   }
// })

// Catch-all route
app.get('*', (req, res) => res.status(404).send('404 Page not found'));
