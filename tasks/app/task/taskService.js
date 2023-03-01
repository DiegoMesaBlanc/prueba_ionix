'use strict'

const database = require("../common/database");
const codes = require("../common/enums/codesResponse");
const states = require("../common/enums/codeStates");
const profiles = require("../common/enums/codeProfiles");
const loggerManagement = require("../common/logger");
const fs = require('fs');
const directory = '../data_base_json/Tasks.json';


let services = {};


services.createTaskService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    const message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      db_tasks.tasks.push({
        uuid: Math.floor(Math.random() * 100),
        title: data.title,
        description: data.description,
        state: data.user.profile == profiles.EJECUTOR ? states.ASIGNADO : states.CREADO,
        userId: data.user.profile == profiles.EJECUTOR ? data.user.id : '',
        initDate: new Date().toLocaleDateString("en-GB").replaceAll('/', '-'),
        finishDate: data.finishDate
      });

      message.code = codes.SUCCESS;
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.assignTaskService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    const db_users = await database.getUsers();
    const index_task = db_tasks.tasks.map(e => e.uuid).indexOf(data.taskId);
    const index_user = db_users.users.map(e => e.uuid).indexOf(data.user.id);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (data.user.profile == profiles.EJECUTOR) {
        if (index_task > -1 && index_user > -1) {
          db_tasks.tasks[index_task].userId = data.user.id;
          if (db_tasks.tasks[index_task].state != states.ASIGNADO) {
            if (db_tasks.tasks[index_task].state == states.CREADO && db_tasks.tasks[index_task].state != states.ELIMINADO) {
              db_tasks.tasks[index_task].state = states.ASIGNADO;
              message.code = codes.SUCCESS;
            }
          } else {
            message.code = codes.TECHNICAL_ERROR;
          }
        } else {
          message.code = codes.DATA_NOT_FOUND;
        }
      } else {
        message.code = codes.UNPROCESSABLE_ENTITY;
      }
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.deleteTaskService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    const index = db_tasks.tasks.map(e => e.uuid).indexOf(data.taskId);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (index > -1) {
        if (db_tasks.tasks[index].state != states.ASIGNADO) {
          db_tasks.tasks.splice(index, 1);

          message.code = codes.SUCCESS;
        } else {
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updateTaskService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    const index = db_tasks.tasks.map(e => e.uuid).indexOf(data.task.uuid);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (index > -1) {
        if (db_tasks.tasks[index].state != states.ASIGNADO) {
          tdb_tasks.asks[index] = data.task;

          message.code = codes.SUCCESS;
        } else {
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.getTaskService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    let message = { code: codes.UNAUTHORIZED, data: null };
    let list = [];

    if (data.profile == profiles.EJECUTOR) {
      list = db_tasks.tasks.filter(el => el.userId == data.uuid);
    }

    if (data.profile == profiles.AUDITOR) {
      list = db_tasks.tasks.filter(el => el.state == states.ASIGNADO);
    }

    if (list.length > 0) {
      message = { code: codes.SUCCESS, data: list };
    } else {
      message.code = codes.DATA_NOT_FOUND
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updateTaskEjecutorService = async (data) => {
  try {
    const db_tasks = await database.getTasks();
    const date = new Date().toLocaleDateString("en-GB").replaceAll('/', '-');
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.EJECUTOR) {
      const list = db_tasks.tasks.filter(
        el => el.userId == data.task.userId && el.uuid == data.task.uuid
      );

      if (list.length > 0) {
        const index = db_tasks.tasks.map(e => e.uuid).indexOf(list[0].uuid);

        if (list[0].finishDate >= date && list[0].state == states.ASIGNADO) {
          db_tasks.tasks[index] = data.task;
          message.code = codes.SUCCESS;
        } else {
          db_tasks.tasks[index].comment = data.task.comment;
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    fs.writeFile(directory, JSON.stringify(db_tasks, null, 2), (err) => {
      if (err) return console.log(err);
    });

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = services;
