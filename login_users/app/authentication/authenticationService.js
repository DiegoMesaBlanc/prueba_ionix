'use strict'

const database = require("../common/database");
const codes = require("../common/enums/codesResponse");
const loggerManagement = require("../common/logger");
const encrypt = require("./../common/encrypt");
const jwtFuncs = require("./../common/jwtFuncs");
const profiles = require("../common/enums/codeProfiles");
const fs = require('fs');
const directory = '../data_base_json/Users.json';


let services = {};


/**
 * Filtra el usuario, valida que exista y la contraseña coincida
 * @param {*} user Usuario que intenta hacer login
 * @returns Token con la información del usuario
 */
services.userAuthService = async (user) => {
  try {
    const ds_users = await database.getUsers();
    const index = ds_users.users.map(e => e.user).indexOf(user.userName);
    let message = { code: codes.UNAUTHORIZED, data: null };

    if (index != -1) {
      //verifica si la contraseña es correcta
      const STATUS = await encrypt.comparePasswordHash(user.password, ds_users.users[index].password);

      if (STATUS) {
        if (ds_users.users[index].last3Pass.length > 0) {
          const TOKEN = await jwtFuncs.signAuth({
            uuid: ds_users.users[index].uuid,
            user: ds_users.users[index].user,
            profile: ds_users.users[index].profile,
          });

          ds_users.users[index].token = TOKEN;
          message = { code: codes.SUCCESS, data: TOKEN };
        } else {
          message = { code: codes.UNPROCESSABLE_ENTITY, data: null };
        }
      }
    }

    fs.writeFile(directory, JSON.stringify(ds_users, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
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
services.logOutService = async (uuid) => {
  try {
    const ds_users = await database.getUsers();
    const index = ds_users.users.map(e => e.uuid).indexOf(uuid);
    let message = { code: codes.UNAUTHORIZED };

    if (index != -1) {
      ds_users.users[index].token = '';
      message = { code: codes.SUCCESS };
    }

    fs.writeFile(directory, JSON.stringify(ds_users, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.createUserService = async (data) => {
  try {
    const ds_users = await database.getUsers();
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (data.user.profile != profiles.ADMINISTRADOR) {
        ds_users.users.push({
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

    fs.writeFile(directory, JSON.stringify(ds_users, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updatePasswordService = async (data) => {
  try {
    const ds_users = await database.getUsers();
    const index = ds_users.users.map(e => e.user).indexOf(data.user.user);
    let message = { code: codes.UNAUTHORIZED };

    if (index > -1) {
      const status = await encrypt.comparePasswordHash(data.user.lastPassword, ds_users.users[index].password);

      if (status) {
        const encrypt_pass = await encrypt.generateHashPassword(data.user.newPassword);

        ds_users.users[index].last3Pass.length >= 3 ?? ds_users.users[index].last3Pass.splice(0, 1);
        ds_users.users[index].password = encrypt_pass;
        ds_users.users[index].last3Pass.push(encrypt_pass);

        message.code = codes.SUCCESS;
      } else {
        message.code = codes.UNPROCESSABLE_ENTITY;
      }
    } else {
      message.code = codes.DATA_NOT_FOUND;
    }

    fs.writeFile(directory, JSON.stringify(ds_users, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = services;
