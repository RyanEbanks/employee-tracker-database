/*View All Departments*/
SELECT * FROM department;

/*View All Roles*/
SELECT employeeRole.id, employeeRole.title, department.department_name, employeeRole.salary 
FROM employeeRole
JOIN employee_db.department ON employee_db.department.id=employee_db.employeeRole.id;

/*View All Employees*/
/*We join the department name from department table on the id from department table which will be equal to the foreign key*/
/*We give the foreign key values to match the id field from department, so 1 is Sales department and salesperson and saleslead should have a dep_id of 1*/
SELECT employee.id, employee.first_name, employee.last_name, employeeRole.title, department.department_name, employeeRole.salary, employee.first_name WHERE employee.manager_id IS NOT NULL FROM employeeRole
JOIN department ON department.id = employeeRole.department_id


SELECT employee.id, employee.first_name, employee.last_name, employeeRole.title, department.department_name, employeeRole.salary
FROM employeeRole
JOIN department ON department.id = employeeRole.department_id 
JOIN employee ON employee.role_id = employeeRole.id
WHERE employee.manager_id IS NOT NULL;


/*Add a Department*/
/*Would probably need to have something to reference the index# in js. Index# would match the auto incremented id#*/
INSERT INTO department(department_name) VALUES("Would need the string of whatever entered here");

/*Add an Employee*/
INSERT INTO employee_db.employee(first_name, last_name) VALUES("place values from js here", "Same for this one");
/*Find a way to use the managers id, add it in the insert and have the name appear*/

/*Add a Role*/
/*Based on selection it will generate the correct stuff eg if they choose sales person then it will set the price to 80000*/
INSERT INTO employee_db.employeeRole(title, salary) VALUES ("NEED js value here", "Need js value here");

/*Update an employee role*/
UPDATE employee_db.employee SET role_id = 1 WHERE first_name= info AND last_name=  info;
