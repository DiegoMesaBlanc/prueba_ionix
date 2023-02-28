'use strict'

const http = require('http');
const app = require('./app/application');

const hostname = 'localhost';
const port = 3000;


http.createServer(app).listen(3000, () => {
    console.log(`Servicio corriendo en: http://${hostname}:${port}/`);
});
