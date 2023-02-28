const validate = require('validator');

validator = {}

//VALIDA SI ENVIAN O NO DATOS(SI NO TENEMOS INFORMACION RESPONDE FALSE Y EL SERVICIO GENERA ERROR)
validator.validateDataPersonalDocument = (data) => {
    try {
        if (!data.fileName) return false
        if (!data.fileContent) return false
        if (!isValidDate(data.expirationDate)) return false
        return data;
    } catch (e) {
        console.log(e)
        return false
    }
}

//VALIDA LOS DATOS DE LA FECHA
function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

module.exports = validator