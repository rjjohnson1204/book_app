# book_app

**Author**: Michael Goseco
**Version**: 1.1.3

## Overview
This app lets you search Google Books for books based on title or author, then lets you save books to your own personal favorites list.

## Getting Started
Create a server on node.js, build templatized pages with ejs, applying appropriate css styling on each. Add your dependencies to your server.js file, set a listening port for the local host and to the database.

## Architecture
Server: node.js, express, dotenv. Middleware: cors, superagent, postgres. Views: ejs, css, Google Books API.

## Change Log
12-11-2018: Added search form to search Google Books API based on title or author, and render results.

12-12-2018: Added SQL database to save a personal collection of books, view details of each book, and add books to collection.

## Credits and Collaborations
Collaborators: Ray Johnson
