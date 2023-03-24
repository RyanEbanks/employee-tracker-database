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

//Questions for bonus marks not added yet

function  initialize() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "startingChoices",
            message: "Choose an option: ",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
        }

    ]).then((response) => {
        sqlStatements(response);
    });
   
}

// function getTable() {
//     db.query(`SELECT first_name, last_name FROM employee`, function (err, results) {
//       if (err) throw err;
//       console.table(results);
//     });
//   }
  

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
        // getTable();
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
                type: "input",
                name: "updateByFName",
                message: "What is the name of the role? "
            },
            {
                type: "input",
                name: "updateByLName",
                message: "What is the salary of the role? "
            },
            {
                type: "input",
                name: "newRole",
                message: "What department does the role belong to? "
            },
        ]).then((response) => {
            let roleArray = [];

            db.query(`SELECT department_name FROM employee_db.employeeRole`, (error, results) => {
                if (error) {
                  throw error;
                }
                const roleArray = results.map(result => result.department_name);
                console.log(roleArray);
              });
              

            if(roleArray.includes(response.newRole)) {
                idInput = indexOf(response.newRole) + 1;
                db.query(`UPDATE employee_db.employee SET role_id = ${idInput} WHERE first_name= ${response.updateByFName} AND last_name= ${response.updateByLName}`);
                initialize();
            }
        });
    }
}

  

initialize();