'use strict'

const operations = require("./authenticationOperations");
const responseManagement = require("./../common/responseManagement");
const encrypt = require("./../common/encrypt");
const loggerManagement = require("../common/logger");
const codes = require("../common/enums/codesResponse");


/**
 * 
 * @param {*} request Intercepta la información del body o cabeceras
 * @param {*} response Respuesta de nuestro servicio
 * @returns Respuesta del proceso de login
 */
exports.userAuthController = async (request, response) => {
  try {
    const user = { userName: request.body.userName || "", password: request.body.password || "" };
    // const pass = await encrypt.generateHashPassword(user.password);
    // console.log(pass);

    const res = await operations.userAuthOperations(user);

    //usuario encontrado en la base de datos
    if (res.code == codes.SUCCESS) {
      const message = {
        code: codes.SUCCESS,
        token: res.data
      };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Password not already update yet.');
    }

    return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. The provided user name and password are invalid.');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};


/**
 * 
 * @param {*} request Intercepta la información del body o cabeceras
 * @param {*} response Respuesta de nuestro servicio
 * @returns Respuesta del proceso de logout
 */
exports.logOutController = async (request, response) => {
  try {
    const res = await operations.logOutOperations(request.tokenData.uuid);

    if (res.code == codes.SUCCESS) {
      const message = { code: codes.SUCCESS, message: 'Logout success' };

      return await responseManagement.SUCCESS(response, message);
    }

    return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. The provided user name and password are invalid.');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - LOGOUT - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
}


exports.createUserController = async (request, response) => {
  try {
    const user_data = { user: request.body || "", profile: request.tokenData.profile };

    const res = await operations.createUserOperation(user_data);

    if (res.code == codes.SUCCESS) {
      const message = { code: codes.SUCCESS, message: 'Success user created' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to create user.');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Only create EJECUTOR or AUDITOR profile.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - LOGOUT - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
}


exports.updatePasswordController = async (request, response) => {
  try {
    const passws = { user: request.body || "" };

    const res = await operations.updatePasswordOperation(passws);

    if (res.code == codes.SUCCESS) {
      const message = { code: codes.SUCCESS, message: 'Success password update' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to update password.');
    } else if (res.code == codes.DATA_NOT_FOUND) {
      return await responseManagement.DATA_NOT_FOUND(response, '');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'First password not match');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - LOGOUT - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
}