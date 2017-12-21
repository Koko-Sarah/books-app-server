'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL;

 

//DATABASE Setup
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/api/v1/books', (req, res) => {
  console.log('successaaaasda');
  client.query('SELECT * FROM books;')

    .then(results => res.send(results.rows))
    .catch(console.error);
});

//route for book detail by id changing route to :id, this :id is like a variable that we can plug in from document, this is express specific syntax, also common to outher routers, :parameter is what :id is doing, these can take regex patterns too, you can do :parameter? making it optional

app.get('/api/v1/books/:id', (req,res)=> {
  client.query(`SELECT * FROM books 
  WHERE book_id=$1;`, [req.params.id])
    .then(console.log(res))
    .then(results => res.send(results.rows))
    .catch(console.error);
});


// app.all('*', (req, res) => res.redirect(CLIENT_URL));//the asterix is a regex pattern match
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

