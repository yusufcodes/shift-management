const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse data sent in POST request - without bodyParser, we had to do this manually. Makes use of Express Middleware in order to do this for us.
// Automatically calls 'next()' to move onto the next middleware.
app.use(bodyParser.urlencoded({ extended: false }));

// req.body -> Made available to us from bodyParser
app.post('/user', (req, res, next) => {
   res.send(`<h1>User: ${req.body.username}</h1>`);
});

// Middleware functions can manipulate for incoming requests, responses, and return them
// next() - move onto another middleware (not sending back a response straight away)
app.get('/', (req, res, next) => {
   res.send(`<form action="/user" method="POST">
   <input type="text" name="username"/>
   <button type="submit">Submit User</button>
   </form>`);
});

app.listen(5000);
