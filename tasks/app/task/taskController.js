'use strict'

const operations = require("./taskOperations");
const responseManagement = require("./../common/responseManagement");
const loggerManagement = require("../common/logger");
const codes = require("../common/enums/codesResponse");


/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
exports.createTaskController = async (request, response) => {
  try {
    const task = {
      title: request.body.title || "",
      description: request.body.description || "",
      finishDate: request.body.finishDate || "",
      user: request.body.user || {},
      profile: request.tokenData.profile
    };

    const res = await operations.createTaskOperation(task);

    if (res.code == codes.SUCCESS) {
      const message = { code: codes.SUCCESS, message: 'Success created task' };

      return await responseManagement.SUCCESS(response, message);
    }

    return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. The provided cannot create task.');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};


exports.assignTaskController = async (request, response) => {
  try {
    const task = {
      user: request.body.user || "",
      taskId: request.body.taskId || "",
      profile: request.tokenData.profile
    };

    const res = await operations.assignTaskOperation(task);

    if (res.code == codes.UNAUTHORIZED) {
      const message = { code: codes.SUCCESS, message: 'Success. Task assign' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to assign task.');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Only assign task EJECUTOR profile.');
    } else if (res.code == codes.DATA_NOT_FOUND) {
      return await responseManagement.DATA_NOT_FOUND(response, 'Task not found.');
    } else if (res.code == codes.TECHNICAL_ERROR) {
      return await responseManagement.TECHNICAL_ERROR(response, 'Task already assigned.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};



exports.deleteTaskController = async (request, response) => {
  try {
    const task = { taskId: request.body.taskId || "", profile: request.tokenData.profile };

    const res = await operations.deleteTaskOperation(task);

    if (res.code == codes.UNAUTHORIZED) {
      const message = { code: codes.SUCCESS, message: 'Task deleted' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to delete task.');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Task is assigned. Cannot delete.');
    } else if (res.code == codes.DATA_NOT_FOUND) {
      return await responseManagement.DATA_NOT_FOUND(response, 'Task not found.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};


exports.updateTaskController = async (request, response) => {
  try {
    const task = { task: request.body || "", profile: request.tokenData.profile };

    const res = await operations.updateTaskOperation(task);

    if (res.code == codes.UNAUTHORIZED) {
      const message = { code: codes.SUCCESS, message: 'Task updated' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to update task.');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Task is assigned. Cannot update.');
    } else if (res.code == codes.DATA_NOT_FOUND) {
      return await responseManagement.DATA_NOT_FOUND(response, 'Task not found.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};


exports.getTasksController = async (request, response) => {
  try {
    const res = await operations.getTasksOperation(request.tokenData.uuid);

    if (res.code == codes.UNAUTHORIZED) {
      const message = { code: codes.SUCCESS, tasks: res.data };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code != codes.SUCCESS) {
      return await responseManagement.DATA_NOT_FOUND(response, 'Unauthorized. The provided user cannot list tasks.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};


exports.updateTaskEjecutorController = async (request, response) => {
  try {
    const data = { task: request.body || "", profile: request.tokenData.profile };

    const res = await operations.updateTaskEjecutorOperation(data);

    if (res.code == codes.UNAUTHORIZED) {
      const message = { code: codes.SUCCESS, message: 'Upload task' };

      return await responseManagement.SUCCESS(response, message);
    } else if (res.code == codes.UNAUTHORIZED) {
      return await responseManagement.UNAUTHORIZED(response, 'Unauthorized. Do not have permisses to update task.');
    } else if (res.code == codes.UNPROCESSABLE_ENTITY) {
      return await responseManagement.UNPROCESSABLE_ENTITY(response, 'Expired task. Only update a comment');
    } else if (res.code == codes.DATA_NOT_FOUND) {
      return await responseManagement.DATA_NOT_FOUND(response, 'Task not found.');
    }

    return await responseManagement.SERVER_ERROR(response, 'Internal server error');
  } catch (error) {
    loggerManagement.insertLog(new Date().getTime(), request.method, 'CONTROLLER - AUTH - ', request.path, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return await responseManagement.SERVER_ERROR(response, JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
  }
};