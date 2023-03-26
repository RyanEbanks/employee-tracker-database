const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
//Importing mysql
const mysql = require("mysql2");

//Importing password
const password = require("./assets/js/config");

//Importing console table to view SQL databases in a different format
const cTable = require('console.table');

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: `${password}`,
        database: 'employee_db'
    },

    console.log('Connected to the database')
);

let nameArray = [];
let roleArray = [];


db.query(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employee`, (err, result) => {
    try {
        if(err) throw err;
        for(let i = 0; i <result.length; i++) {
            nameArray.push(result[i].name);
        }
    } catch(err) {
        console.log(err);
    }
});

db.query(`SELECT title FROM employeeRole`, (err, result) => {
    try {
        if(err) throw err;
        for(let i = 0; i <result.length; i++) {
            roleArray.push(result[i].title);
        }
    } catch(err) {
        console.log(err);
    }
});


//Questions for bonus marks not added yet

function  initialize() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "startingChoices",
            message: "Choose an option: ",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "View employees by manager", "View employees by department"]
        }

    ]).then((response) => {
        sqlStatements(response);
    });
   
}

function sqlStatements(choice) {
    if (choice.startingChoices === "View all departments") {
        db.query(`SELECT * FROM department`, function (err, results) {
            console.table("\n", results);
            initialize();
        });
    } else if (choice.startingChoices === "View all roles") {
        db.query(
    `SELECT employeeRole.id, employeeRole.title, department.department_name, employeeRole.salary 
    FROM employeeRole
    JOIN department ON department.id=employeeRole.department_id`, function (err, results) {
            console.table("\n", results);
            initialize();
        });
       
    } else if (choice.startingChoices === "View all employees") {
        db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, 
    employeeRole.title, department.department_name, employeeRole.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    JOIN employeeRole ON employee.role_id=employeeRole.id
    JOIN department ON employeeRole.department_id= department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`, function (err, results) {
            console.table("\n", results);
            initialize();
        });
    } else if (choice.startingChoices === "Add a department") {
        inquirer.prompt([
            {
                type: "input",
                name: "addADepartment",
                message: "Please enter a name for the department: "
            }
        ]).then((response) => {
            db.query(`INSERT INTO department(department_name) VALUES("${response.addADepartment}")`)
            initialize();
        });
    }

    if (choice.startingChoices === "Add a role") {
        inquirer.prompt([
            //Set this up so that add a role starts here
            {
                type: "input",
                name: "addARole",
                message: "What is the name of the role? "
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role? "
            },
            //figure out a way to use department id to get the department
            {
                type: "input",
                name: "departmentRole",
                message: "What department does the role belong to? "
            },
        ]).then((response) => {

         db.query(
            `INSERT INTO employee_db.employeeRole (title, salary, department_id)
            VALUES ('${response.addARole}', ${response.roleSalary}, (SELECT id FROM employee_db.department WHERE department_name = '${response.departmentRole}'))
            `);
            initialize();
        });
    } else if (choice.startingChoices === "Add an employee") {
        inquirer.prompt([
            {
                type: "input",
                name: "employeeFirstName",
                message: "What is the employee's first name? "
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name? "
            },
            {
                type: "input",
                name: "employeeRole",
                message: "What is the employee's role? "
            },
            {
                type: "rawlist",
                name: "employeeManager",
                message: "Who is the employee's manager? ",
                choices: nameArray
            }
        ]).then((response) => {
            
            db.query(
                `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                SELECT "${response.employeeFirstName}", "${response.employeeLastName}", employeeRole.id, employee.id
                FROM employeeRole, employee
                WHERE employeeRole.title = "${response.employeeRole}"
                AND CONCAT (employee.first_name, " ", employee.last_name) = "${response.employeeManager}"`
                );
            initialize();
        });
    } else if (choice.startingChoices === "Update an employee role") {
        inquirer.prompt([
            //Set this up so that add a role starts here
            {
                type: "rawlist",
                name: "updateRole",
                message: "Which employee's role do you want to update? ",
                choices: nameArray
            },
            {
                type: "rawlist",
                name: "updateByName",
                message: "Which role do you want to assign to the selected employee? ",
                choices: roleArray
            }
        ]).then((response) => {
            let splitText = response.updateRole;
            const mySplitArray = splitText.split(" ");

            db.query(
            `UPDATE employee
            SET role_id = (SELECT department_id FROM employeeRole WHERE title = 'Lead Engineer' LIMIT 1)
            WHERE first_name = '${mySplitArray[0]}' AND last_name = '${mySplitArray[1]}'`);
            console.table("First Name: ", mySplitArray[0])
            console.table("Last Name: ", mySplitArray[1])
            
            db.query(
                `UPDATE employeeRole 
                SET title = '${response.updateByName}', 
                salary = (SELECT salary FROM (SELECT * FROM employeeRole) AS er WHERE title = '${response.updateByName}' LIMIT 1), 
                department_id = (SELECT department_id FROM (SELECT * FROM employeeRole) AS er WHERE title = '${response.updateByName}' LIMIT 1)
                WHERE id = (SELECT role_id FROM employee WHERE first_name = '${mySplitArray[0]}' AND last_name = '${mySplitArray[1]}');`)

            initialize();
        });
    }  else if (choice.startingChoices === "View employees by manager") {
            db.query(
                `SELECT e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
                FROM employee e
                LEFT JOIN employee m ON e.manager_id = m.id
                WHERE e.manager_id IS NOT NULL`, function(err, results) {
                    console.table("\n", results);
                    initialize();
                });
                
    } else if (choice.startingChoices === "View employees by department") {
            db.query(
                `SELECT e.first_name, e.last_name, d.department_name
                FROM employee e
                JOIN employeeRole er ON e.role_id = er.id
                JOIN department d ON er.department_id = d.id
                ORDER BY d.department_name`, function(err, results) {
                    console.table("\n", results);
                    initialize();
                });
                
    }
}

function welcome() {
    console.table(`
---------------------------
| WELCOME TO THE EMPLOYEE |
|    TRACKER DATABASE     |
--------------------------- `);
    return initialize();
}

welcome();