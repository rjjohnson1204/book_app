CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('Jean Craighead George', 'How to Talk to Your Cat', '9781439554043', 'http://books.google.com/books/content?id=apVrPwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', 'Provides early readers with a guide to cat communication by explaining the meaning behind cat expressions, cries, meows, and purrs. Reprint.', 'Cats');
