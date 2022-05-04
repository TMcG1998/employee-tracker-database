const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees'
    },
    console.log('Connected to the employees database.')
)

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])
    .then(({ action }) => {
        console.log("Action: " + action);
    
        switch (action) {
            case 'View all departments':
                var sql = `SELECT * FROM department`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.table(rows);
                })
                break;
            case 'View all roles':
                var sql = `SELECT role.*, department.name
                AS department_name 
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.table(rows);
                })
                break;
            case 'View all employees':
                var sql = `SELECT * FROM employee`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.table(rows);
                })
                break;
            case 'Add a department':
                break;
            case 'Add a role':
                break;
            case 'Add an employee':
                break;
            case 'Update an employee role':
                break;
        }
    });
}

promptUser().catch(err => {
    console.log(err);
});