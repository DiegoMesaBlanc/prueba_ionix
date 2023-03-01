const db_users = require("../../../data_base_json/Users.json");
const db_tasks = require("../../../data_base_json/Tasks.json");

let databaseFuncs = {}

/**
 * Obtiene los usuarios encontrado en base de datos
 * @returns Usuarios de base de datos
 */
databaseFuncs.getUsers = async () => {
    return await db_users;
}


/**
 * Obtiene las tareas encontradas en base de datos
 * @returns Tareas de base de datos
 */
databaseFuncs.getTasks = async () => {
    return await db_tasks;
}

module.exports = databaseFuncs;
