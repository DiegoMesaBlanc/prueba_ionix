'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


require('./common/microserviceConfig').configInitial();


const authenticationRoutes = require('./authentication/authenticationRoutes');


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '4mb' }));

app.use(authenticationRoutes)


module.exports = app