'use strict'

const service = require("./authenticationService");
const loggerManagement = require("../common/logger");

let operations = {};


/**
 * 
 * @param {*} user Informacion del usuario a generar login
 * @returns Codigo y data desde el Service
 */
operations.userAuthOperations = async (user) => {
  try {
    const data = await service.userAuthService(user);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


/**
 * 
 * @param {*} uuid Id de usuario a generar logout
 * @returns Codigo y data desde el Service
 */
operations.logOutOperations = async (uuid) => {
  try {
    const data = await service.logOutService(uuid);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.createUserOperation = async (user_data) => {
  try {
    const data = await service.createUserService(user_data);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.updatePasswordOperation = async (pass) => {
  try {
    const data = await service.updatePasswordService(pass);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = operations;
