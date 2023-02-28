'use strict'

let loggers = {}

//CONFIGURACION DE LOS LOGS PARA VERIFICACION DE ERRORES
//Metodo general para validar hacia que logger tiene que ir de acuerdo a la base de datos 
loggers.insertLog = (time, method, capa, url, message) => {
    new Promise((resolve, reject) => {
        loggerTrazabilidad(time, method, capa, url, message);
    });
}

function loggerError(time, method, capa, path, message) {
    console.log("[" + time + "] [ERROR] " + method + "," + path + "," + JSON.stringify(message, Object.getOwnPropertyNames(message)));
}

function loggerTrazabilidad(time, method, capa, path, message) {
    let logMessage = `[${time}][FULL] ${capa} - ${method}${path}, ${JSON.stringify(message)}`;
    console.log(logMessage);
}

module.exports = loggers