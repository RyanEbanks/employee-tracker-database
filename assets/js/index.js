const inquirer = require("inquirer");
const fs = require("fs");
//Importing mysql
const mysql = require("mysql2");

//Importing password
const password = require("./config");

//Importing multiple functions from generateSql
const {viewDepartment, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole} = require("./generateSql");

function writeToFile(filename, data) {

    fs.writeFile(filename, data, (error, data) => {
        if(error) {
            console.log(error);
        }
        console.log(data);
    });
}

//Questions for bonus marks not added yet

function initialize() {
    inquirer.prompt([
    {
        type: "rawlist",
        name: "startingChoices",
        message: "Choose an option: ",
        choices: ["View all departments", "View all roles", "View All employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    },
    //Set this up so that if they select add a department it goes here
    {
        type: "input",
        name: "addADepartment",
        message: "Please enter a name for the department: "
    },
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
    //After this question below prompt them to go back to the first question
    {
        type: "input",
        name: "departmentRole",
        message: "What department does the role belong to? "
    },
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
        type: "input",
        name: "employeeManager",
        message: "Who is the employee's manager? "
    }
    
]).then((response) => {

    const viewDepartment = viewDepartment(response);
    const viewRoles = viewRoles(response);
    const viewEmployees = viewEmployees(response);
    const addDepartment = addDepartment(response);
    const addRole = addRole(response);
    const addEmployee = addEmployee(response);
    const updateEmployeeRole = updateEmployeeRole(response);

});
}


initialize();