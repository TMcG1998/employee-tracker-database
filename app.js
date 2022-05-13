const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./db');
const { findDepartment, findRoles, findEmployees, addDepartment, addEmployee } = require('./db');
const connection = require('./db/connection');


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

            if (action == 'View all departments') {
                db.findDepartment()
                .then((depar) => console.table(depar[0].map(x => x.name)))
                repeat();
            }

            if (action == 'View all roles') {
                db.findRoles()
                .then((role) => console.table(role[0]))
                repeat();
            }

            if (action == 'View all employees') {
                db.findEmployees()
                .then((employees) => console.table(employees[0]))
                repeat();
            }

            if (action == 'Add a department') {
                return inquirer.prompt({
                    type: 'text',
                    message: 'Enter the department name you wish to add:',
                    name: 'department'
                }).then(({ department }) => {
                    db.addDepartment(department);
                    console.log("Added")
                    repeat();
                })
            }

            if (action == 'Add a role') {
                // Use a promise to query what departments we can select inside of Inquirer prompts
                db.findDepartment()
                    .then(([rows]) => {
                        // Return the existing departments to inquirer
                        return rows;
                    })
                    .then((retVar) => {
                        return inquirer.prompt([
                            {
                                type: 'text',
                                message: 'Enter the role name you wish to add:',
                                name: 'role'
                            },
                            {
                                type: 'number',
                                message: 'What is the salary of the role?',
                                name: 'salary'
                            },
                            {
                                type: 'list',
                                message: 'Which department does the role belong to?',
                                name: 'department',
                                // Existing departments are presented by name only
                                choices: retVar.map(a => a.name)
                            }
                        ]).then((roleData) => {
                            // Filter the department array to get the corresponding id to the name chosen by the user
                            const deparId = retVar.filter(department => department.name == roleData.department)[0].id;
                            const params = [roleData.role, roleData.salary, deparId];

                            return params;
                        }).then((params) => {
                            db.addRole(params);
                        }).then(() => {
                            console.log("Added successfully!");
                            repeat();
                        })
                    })
                }

            if(action == 'Add an employee') {
                var fullEmployeeData = [];
                var employeesNames = [];
                var managers = [];

                db.findEmployees()
                    .then(([rows]) => {
                        fullEmployeeData = rows;
                        employeesNames = rows.map(({first_name, last_name}) => ({ first_name, last_name }));
                        for(let i = 0; i < employeesNames.length; i++) {
                            managers.push(employeesNames[i].first_name + " " + employeesNames[i].last_name);
                        }
                    })
                db.findRoles()
                    .then(([rows]) => {
                        return rows;
                    })
                    .then((retVar) => {
                        return inquirer.prompt([
                            {
                                type: 'text',
                                message: 'First name:',
                                name: 'firstName'
                            },
                            {
                                type: 'text',
                                message: 'Last name:',
                                name: 'lastName'
                            },
                            {
                                type: 'list',
                                message: 'What is this employees role?',
                                name: 'role',
                                choices: retVar.map(a => a.title)
                            },
                            {
                                type: 'list',
                                message: "Who is this employee's manager?",
                                name: 'manager',
                                choices: managers
                            }
                        ]).then((employeeData) => {
                            // TODO: filter employeeData.role to get role id from retVar
                            const roleId = retVar.filter(role => role.title == employeeData.role)[0].id;
                            var managerId = fullEmployeeData.filter(obj => {
                                return `${obj.first_name} ${obj.last_name}` === employeeData.manager
                            })
                            console.log(managerId);
                            // TODO: Make call to SQL database to insert employee data
                            const params = [employeeData.firstName, employeeData.lastName, roleId, managerId[0].id];
                            
                            return params;
                        }).then((params) => {
                            db.addEmployee(params)
                        }).then(() => {
                            console.log("Added successfully!");
                            repeat();
                        })
                    })
                }
            
            if(action == 'Update an employee role') {
                var fullEmployeeData = [];
                var employeesNames = [];
                var managers = [];

                db.findEmployees()
                    .then(([rows]) => {
                        console.log(rows);
                        fullEmployeeData = rows;
                        employeesNames = rows.map(({first_name, last_name}) => ({ first_name, last_name }));
                        for(let i = 0; i < employeesNames.length; i++) {
                            managers.push(employeesNames[i].first_name + " " + employeesNames[i].last_name);
                        }
                        console.log(managers);
                    })
                db.findRoles()
                    .then(([rows]) => {
                        return rows;
                    })
                    .then((roles) => {
                        console.log(roles);
                        return inquirer.prompt([
                            {
                                type: 'list',
                                message: 'Which employee do you wish to update?',
                                name: 'employee',
                                choices: managers
                            },
                            {
                                type: 'list',
                                message: 'What is their new role?',
                                name: 'role',
                                choices: roles.map(a => a.title)
                            }
                        ]).then((inquireData) => {
                            console.log(inquireData);
                            // const selectedEmployee = managers.map(name => {
                            //     const obj = {};
                            //     obj.name = name;
                            //     obj.id = fullEmployeeData.find(employee => {
                            //         `${employee.first_name} ${employee.last_name}` === name
                            //     });
                            //     console.log(obj);
                            //     return obj;
                            // })
                            var roleId = roles.filter(obj => {
                                return obj.title === inquireData.role
                            })
                            var employeeId = fullEmployeeData.filter(obj => {
                                return `${obj.first_name} ${obj.last_name}` === inquireData.employee
                            })
                            var params = [roleId[0].id, employeeId[0].id];
                            db.updateRole(params)
                            .then(() => {
                                console.log("Employee updated.")
                                repeat();
                            })       
                        })
                    })
            }

            if(action == 'Exit') {
                return;
            }
        })
}

function repeat() {
    setTimeout(() => {
        return promptUser();
    }, 1000);
}

promptUser()
    .catch(err => {
        console.log(err);
    });
