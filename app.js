const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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

        if (action == 'View all departments') {
            var sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                
            console.log("-----------------");
            console.table(rows);
            })
            return true;
               
        }  
        //     case 'View all roles':
        //         var sql = `SELECT role.*, department.name
        //         AS department_name 
        //         FROM role
        //         LEFT JOIN department
        //         ON role.department_id = department.id`;
        //         db.query(sql, (err, rows) => {
        //             if (err) {
        //                 console.log(err.message);
        //                 return;
        //             }
        //             console.table(rows);
        //             retVar = true;
        //         })
        //         break;
        //     case 'View all employees':
        //         var sql = `SELECT * FROM employee`;
        //         db.query(sql, (err, rows) => {
        //             if (err) {
        //                 console.log(err.message);
        //                 return;
        //             }
        //             console.table(rows);
        //             retVar = true;
        //         })
        //         break;
        //     case 'Add a department':
        //         break;
        //     case 'Add a role':
        //         break;
        //     case 'Add an employee':
        //         break;
        //     case 'Update an employee role':
        //         break;
        // }
        return false;
    }).then((repeat) => {
        if(repeat) {
            return promptUser();
        } else {
            db.end();
            return;
        }
    })
}


promptUser()
    .catch(err => {
        console.log(err);
    });