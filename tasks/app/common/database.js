const db_users = require("../data_base_json/Users.json");
const db_tasks = require("../data_base_json/Tasks.json");

let databaseFuncs = {}

/**
 * 
 * @returns Usuarios de base de datos
 */
databaseFuncs.getUsers = async () => {
    return await db_users.users;
}

databaseFuncs.getTasks = async () => {
    return await db_tasks.tasks;
}

module.exports = databaseFuncs;
