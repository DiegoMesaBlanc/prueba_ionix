'use strict'

const database = require("../common/database");
const codes = require("../common/enums/codesResponse");
const loggerManagement = require("../common/logger");
const encrypt = require("./../common/encrypt");
const jwtFuncs = require("./../common/jwtFuncs");
const profiles = require("../common/enums/codeProfiles");

let services = {};


/**
 * Filtra el usuario, valida que exista y la contraseña coincida
 * @param {*} user Usuario que intenta hacer login
 * @returns Token con la información del usuario
 */
services.filterUser = async (user) => {
  try {
    const res = await database.getUsers();
    const index = res.map(e => e.user).indexOf(user.userName);
    let message = { code: codes.UNAUTHORIZED, data: null };

    if (index != -1) {
      //verifica si la contraseña es correcta
      const STATUS = await encrypt.comparePasswordHash(user.password, res[index].password);

      if (STATUS) {
        if (res[index].last3Pass.length > 0) {
          const TOKEN = await jwtFuncs.signAuth({
            uuid: res[index].uuid,
            user: res[index].user,
            profile: res[index].profile,
          });

          res[index].token = TOKEN;
          message = { code: codes.SUCCESS, data: TOKEN };
        } else {
          message = { code: codes.UNPROCESSABLE_ENTITY, data: null };
        }
      }
    }

    return await message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


/**
 * 
 * @param {*} uuid Identificador de usuario a hacer logout
 * @returns Codigo de exito o inautorizado
 */
services.logOutUser = async (uuid) => {
  try {
    const res = await database.getUsers();
    const index = res.map(e => e.uuid).indexOf(uuid);
    let message = { code: codes.UNAUTHORIZED };

    if (index != -1) {
      res[index].token = '';
      message = { code: codes.SUCCESS };
    }

    return await message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.createUserService = async (data) => {
  try {
    const res = await database.getUsers();
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (data.user.profile != profiles.ADMINISTRADOR) {
        res.push({
          uuid: Math.floor(Math.random() * 100),
          user: data.user.user,
          password: "$2b$10$Lct6aLj03mQyHrmNLxKvl.hO40heUnfbYIURTAUsn/u5ztrOj0ffe", // Ionix2023+First
          stateLogin: "",
          last3Pass: [],
          profile: data.user.profile,
          token: "",
          insertDate: new Date().toLocaleDateString("en-GB").replaceAll('/', '-'),
          updateDate: "",
          state: "Activo"
        });

        message.code = codes.SUCCESS;
      } else {
        message.code = codes.UNPROCESSABLE_ENTITY;
      }
    }

    return await message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updatePasswordService = async (data) => {
  try {
    const res = await database.getUsers();
    const index = res.map(e => e.uuid).indexOf(data.user.userId);
    let message = { code: codes.UNAUTHORIZED };

    if (index > -1) {
      const status = await encrypt.comparePasswordHash(data.user.lastPassword, res[index].password);

      if (status) {
        const encrypt_pass = await encrypt.generateHashPassword(data.user.newPassword);

        res[index].last3Pass.length >= 3 ?? res[index].last3Pass.splice(0, 1);
        res[index].password = encrypt_pass;
        res[index].last3Pass.push(encrypt_pass);

        message.code = codes.SUCCESS;
      } else {
        message.code = codes.UNPROCESSABLE_ENTITY;
      }
    } else {
      message.code = codes.DATA_NOT_FOUND;
    }

    return await message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = services;
