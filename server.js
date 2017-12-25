'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

// Application Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
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




// FORM POST
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

//FORM DELETE

app.delete('/api/v1/books/:id', (req, res) => {
  console.log('we got to the delete route', req.params.id);
  client.query(`DELETE FROM books WHERE book_id=$1`, [req.params.id])
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.error(err);
      res.status(400).send('Bad Request; Book ID does not exist');
    });
});


// app.delete('api/v1/books/:id', (req, res) => {
//   console.log('we got to the delete route');
//   client.query(`DELETE from books
//     WHERE book_id=$1;`, [req.params.id])

//     .then(function () {
//       res.status(204);
//     });
// });
// app.delete('/books', (request, response) => {
//   client.query('DELETE FROM books')
//   .then(() => response.send('Delete complete'))
//   .catch(console.error);
// });


app.put('/books', (request, response) => {
  console.log('we got to the update route', req.params.id);
  client.query(`
      UPDATE books
      SET book_id=$1, title=$2, author=$3, isbn=$4, description=$5
      WHERE article_id=$6
      `,
    [
      request.body.book_id,
      request.body.title,
      request.body.author,
      request.body.publishedOn,
      request.body.description,
      request.params.id
    ]
  )
    .then(() => response.send('Update complete'))
    .catch(console.error);
});



///////////////////catchall
app.all('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

