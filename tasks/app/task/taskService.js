'use strict'

const database = require("../common/database");
const codes = require("../common/enums/codesResponse");
const states = require("../common/enums/codeStates");
const profiles = require("../common/enums/codeProfiles");
const loggerManagement = require("../common/logger");

let services = {};


services.createTaskService = async (data) => {
  try {
    const tasks = await database.getTasks();
    const message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      tasks.push({
        uuid: Math.floor(Math.random() * 100),
        title: data.title,
        description: data.description,
        state: data.user.profile == profiles.EJECUTOR ? states.ASIGNADO : states.CREADO,
        userId: data.user.profile == profiles.EJECUTOR ?? data.user.id,
        initDate: new Date().toLocaleDateString("en-GB").replaceAll('/', '-'),
        finishDate: data.finishDate
      });

      message.code = codes.SUCCESS;
    }

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.assignTaskService = async (data) => {
  try {
    const tasks = await database.getTasks();
    const index = tasks.map(e => e.uuid).indexOf(data.taskId);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (data.user.profile == profiles.EJECUTOR) {
        if (index > -1) {
          tasks[index].userId = data.user.id;
          if (tasks[index].state != states.ASIGNADO) {
            if (tasks[index].state == states.CREADO && tasks[index].state != states.ELIMINADO) {
              tasks[index].state = states.ASIGNADO;
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

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.deleteTaskService = async (data) => {
  try {
    const tasks = await database.getTasks();
    const index = tasks.map(e => e.uuid).indexOf(data.taskId);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (index > -1) {
        if (tasks[index].state != states.ASIGNADO) {
          tasks.splice(index, 1);

          message.code = codes.SUCCESS;
        } else {
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updateTaskService = async (data) => {
  try {
    const tasks = await database.getTasks();
    const index = tasks.map(e => e.uuid).indexOf(data.task.uuid);
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.ADMINISTRADOR) {
      if (index > -1) {
        if (tasks[index].state != states.ASIGNADO) {
          tasks[index] = data.task;

          message.code = codes.SUCCESS;
        } else {
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.getTaskService = async (profile) => {
  try {
    const tasks = await database.getTasks();
    let message = { code: codes.UNAUTHORIZED, data: null };
    let list = [];

    if (profile == profiles.EJECUTOR) {
      list = tasks.filter(el => el.userId == profile);
    }

    if (profile == profiles.AUDITOR) {
      list = tasks.filter(el => el.state == states.ASIGNADO);
    }

    if (list.length > 0) {
      message = { code: codes.SUCCESS, data: list };
    } else {
      message.code = codes.DATA_NOT_FOUND
    }

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


services.updateTaskEjecutorService = async (data) => {
  try {
    const tasks = await database.getTasks();
    const date = new Date().toLocaleDateString("en-GB").replaceAll('/', '-');
    let message = { code: codes.UNAUTHORIZED };

    if (data.profile == profiles.EJECUTOR) {
      const list = tasks.filter(
        el => el.userId == data.task.userId && el.uuid == data.task.uuid
      );

      if (list.length > 0) {
        const index = tasks.map(e => e.uuid).indexOf(list[0].uuid);

        if (list[0].finishDate >= date && list[0].state == states.ASIGNADO) {
          tasks[index] = data.task;
          message.code = codes.SUCCESS;
        } else {
          tasks[index].comment = data.task.comment;
          message.code = codes.UNPROCESSABLE_ENTITY;
        }
      } else {
        message.code = codes.DATA_NOT_FOUND;
      }
    }

    return message;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'SERVICE', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = services;
