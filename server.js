'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
//Data base set up
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));
//these console logs will run in the REPL where we are running our server, so in gitBASH

//what's cors? definition of middleware:
app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));
//app.get('*', (req, res) => res.redirect(CLIENT_URL));//this is a "wildcard" route, if you do anything weird, I'll kick you back to the client
//scott uses:
app.all('*', (req, res) => res.redirect(CLIENT_URL));

//now we set up a route to get stuff from our database, our server is "an API" it does not serve up html, just gets request and sends responses, this is defining the address that the database info will be served to, if you know use this end point the wildcard is triggered
//when we do this usually the api is called out /api, the version number and / the name

app.get('/api/v1/books', (req, res) =>{// note here we use res

  client.query('SELECT book_id, title, author, image_url, isbn FROM books;')//find more info on these queries under postgres documentation
    .then(results => res.send(results.rows))//here we must use results to distinuish from res
    .catch(console.error);
});

//here we are setting up our port, our little listener
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


///////////////////** DATABASE LOADERS **////////////////
// I don't think we need these console log req adn res.body in both serer and client