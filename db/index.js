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
        return this.connection.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title AS job_title, department.name AS department_name, role.salary AS salary
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`
        );
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

}



module.exports = new DB(connection)