'use strict'

const http = require('http');
const app = require('./app/application');

const hostname = 'localhost';
const port = 3001;


http.createServer(app).listen(port, () => {
    console.log(`Servicio corriendo en: http://${hostname}:${port}/`);
});
