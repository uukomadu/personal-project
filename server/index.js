require('dotenv').config();
const express = require('express');
const {json} = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');

const users = require('./controller/users');
const cart = require('./controller/cart');
const products = require('./controller/products');
const stripeCharge = require('./routes/payment');

const {
    CONNECTION_STRING,
    STRIPE_SECRET
} = process.env;

const bcrypt = require ('bcrypt');

const app = express();

app.use(json());
app.use(cors());
app.set("bcrypt", bcrypt);

app.use( 
    session({
        secret: CONNECTION_STRING,
        resave: false, 
        saveUninitialized: false
    })
);

massive(CONNECTION_STRING).then( db => {
    app.set( 'db', db);
}).catch( err => console.log( err ));

app.get('/api/products', products.getProducts);
app.get('/api/cart', cart.getCart);
app.post('/api/cart', cart.addToCart);
app.put('/api/login', users.login);
app.put('/api/register', users.register);
app.post('/api/payment', stripeCharge);
// app.get('/logout', logout);
// app.get('/api/me', getUser);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});