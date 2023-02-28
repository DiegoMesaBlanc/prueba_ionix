'use strict'

const express = require('express');
const taskController = require('./taskController');
const md_auth = require('./../common/middlewares/authenticated')
const router = express.Router();

// Perfil Administrador
router.post("/task", md_auth.authenticated, taskController.createTaskController);
router.post("/task/assign", md_auth.authenticated, taskController.assignTaskController);
router.delete("/task", md_auth.authenticated, taskController.deleteTaskController);
router.put("/task", md_auth.authenticated, taskController.updateTaskController);

// Perfil ejecutor
router.get("/task/taskList", md_auth.authenticated, taskController.getTasksController);
router.put("/task/taskList", md_auth.authenticated, taskController.updateTaskEjecutorController);


module.exports = router;