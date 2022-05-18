const connection = require('./connection') 
class DB {
    constructor(connection) {
        this.connection = connection
    }

    findDepartment() {
        return this.connection.promise().query("SELECT * FROM department")
    }

    findRoles() {
        return this.connection.promise().query(`SELECT role.id, role.title, role.salary, department.name
        AS department_name 
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id`)
    }

    findEmployees() {
        return this.connection.promise().query(`SELECT E.id, E.first_name, E.last_name, E.manager_id, role.title AS job_title, department.name AS department_name, role.salary AS salary, 
        (SELECT first_name from employee WHERE id = E.manager_id) as manager_name
        FROM employee as E
        JOIN role ON E.role_id = role.id
        JOIN department ON role.department_id = department.id`);
    }

    addDepartment(department) {
        return this.connection.promise().query(`INSERT INTO department (name)
        VALUES (?)`, department);
    }

    addRole(role) {
        return this.connection.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ? ,?)', role)
    }

    addEmployee(employee) {
        return this.connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, employee);
    }

    updateRole(data) {
        return this.connection.promise().query(`UPDATE employee SET role_id = ?
        WHERE id = ?`, data)
    }

    updateManager(data) {
        return this.connection.promise().query(`UPDATE employee SET manager_id = ?
        where id = ?`, data)
    }

}



module.exports = new DB(connection)