'use strict'

const service = require("./taskService");
const loggerManagement = require("../common/logger");

let operations = {};


operations.createTaskOperation = async (task) => {
  try {
    const data = await service.createTaskService(task);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.assignTaskOperation = async (task) => {
  try {
    const data = await service.assignTaskService(task);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.deleteTaskOperation = async (task) => {
  try {
    const data = await service.deleteTaskService(task);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.updateTaskOperation = async (task) => {
  try {
    const data = await service.updateTaskService(task);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.getTasksOperation = async (uuid) => {
  try {
    const data = await service.getTaskService(uuid);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


operations.updateTaskEjecutorOperation = async (info) => {
  try {
    const data = await service.updateTaskEjecutorService(info);

    return await data;
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), '', 'OPERATIONS', '', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await error;
  }
};


module.exports = operations;
