'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

// Application Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = 'postgres://postgres:1234@localhost:5432/books_app';
// const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL;


//////////////////DATABASE Setup
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyParser);

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
  // console.log('your servers running!')
    .then(results => res.send(results.rows))
    .catch(console.error);
});

///////////////////NEW ROUTE
app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books 
  WHERE book_id=$1;`, [req.params.id])
    // .then(console.log(res))
    .then(results => res.send(results.rows))
    .catch(console.error);
  console.log('your getting books by id');
});
///////////////RESTFUL END POINT

app.get('/api/v1/books', (req, res) => {
  client.query('SELECT book_id, title, author, image_url FROM books;')
    .then(results => res.send(results.rows))
    .catch(console.error);
});




// form post
app.post('/api/v1/books', (request, response) => {
  console.log(request.body.title, 'we got to the post route for insertForm');
  client.query(
    `INSERT INTO
    books(title, author, isbn, image_url, description)
    VALUES ($1, $2, $3, $4, $5);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description,
    ]
  )
    .then(function() {
      response.send('insert complete');
    })
    .catch(function(err) {
      console.error(err);
    });
});

///////////////////catchall
app.all('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

