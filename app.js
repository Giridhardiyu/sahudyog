const express = require('express');
const bodyParser = require('body-parser');

const authRoute = require('./src/routers/authRouter')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use('/api/user', authRoute);

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;