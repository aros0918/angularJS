const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/users');

require('./config/passport')(passport);

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() =>
        console.log('MongoDB successfully connected.')
    ).catch(err => console.log(err));

app.use(passport.initialize());

app.use('/api', users);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
