'use strict'
const responses = {};
const codes = require("./enums/codesResponse");


//RESPUESTA EXITOSA
responses.SUCCESS = async (response, message) => {
    return response.status(codes.SUCCESS).send(message);
}

//ERROR DE AUTENTICACION NO ABIERTA
responses.TECHNICAL_ERROR = async (response, mss) => {
    return response.status(codes.TECHNICAL_ERROR).send({
        code: codes.TECHNICAL_ERROR,
        message: mss
    });
}

//RESPUESTA SIN PROCESAR
responses.UNPROCESSABLE_ENTITY = async (response, mss) => {
    return response.status(codes.UNPROCESSABLE_ENTITY).send({
        code: codes.UNPROCESSABLE_ENTITY,
        message: mss
    });
}

//RESPUESTA SIN PROCESAR
responses.NOT_FOUND = async (response, mss) => {
    return response.status(codes.NOT_FOUND).send({
        code: codes.NOT_FOUND,
        message: mss
    });
}

//DATOS NO ENCONTRADOS
responses.DATA_NOT_FOUND = async (response, mss) => {
    return response.status(codes.DATA_NOT_FOUND).send({
        code: codes.DATA_NOT_FOUND,
        message: mss
    });
}

//ERROR CUANDO EL ESTADO DEL USUARIO NO PERMITE INICIO DE SESIÓN
responses.UNAUTHORIZED = async (response, mss) => {
    return response.status(codes.UNAUTHORIZED).send({
        code: codes.UNAUTHORIZED,
        message: mss
    });
}

//ERROR EN LOS SERVIDORES
responses.SERVER_ERROR = async (response, messageResponse = "Internal server error") => {
    return response.status(500).send({
        message: messageResponse
    });
}




module.exports = responses