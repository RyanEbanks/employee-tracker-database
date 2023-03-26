/*View All Departments*/
SELECT * FROM department;

/*Adding an Employee Verified*/
INSERT INTO employee(first_name, last_name, role_id, manager_id)
SELECT "Joey", "Wu", employeeRole.id, employee.id
FROM employeeRole, employee
WHERE employeeRole.title = "Sales Lead"
AND CONCAT (employee.first_name, " ", employee.last_name) = "Matthew Brown";

/*View All Employees Verified*/
SELECT employee.id, employee.first_name, employee.last_name, 
       employeeRole.title, department.department_name, employeeRole.salary,
       CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee
JOIN employeeRole ON employee.role_id=employeeRole.id
JOIN department ON employeeRole.department_id= department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;


/*Adding a department*/
INSERT INTO department(department_name) VALUES("Chemist");

/*Adding a Role*/
INSERT INTO employee_db.employeeRole (title, salary, department_id)
VALUES ('Chemical Engineer', 200000, (SELECT id FROM employee_db.department WHERE department_name = 'Chemist'));

/*View All Roles*/
SELECT employeeRole.id, employeeRole.title, department.department_name, employeeRole.salary 
FROM employeeRole
JOIN department ON department.id=employeeRole.department_id;

/*Update an Employee*/
UPDATE employee
SET role_id = (SELECT department_id FROM employeeRole WHERE title = 'Lead Engineer' LIMIT 1)
WHERE first_name = 'Matthew' AND last_name = 'Brown';

UPDATE employeeRole 
SET title = 'Lead Engineer', 
    salary = (SELECT salary FROM (SELECT * FROM employeeRole) AS er WHERE title = 'Lead Engineer' LIMIT 1), 
    department_id = (SELECT department_id FROM (SELECT * FROM employeeRole) AS er WHERE title = 'Lead Engineer' LIMIT 1)
WHERE id = (SELECT role_id FROM employee WHERE first_name = 'Matthew' AND last_name = 'Brown');


/*View All Employees by Manager*/
SELECT e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
WHERE e.manager_id IS NOT NULL;

/*View Employees by Department*/
SELECT e.first_name, e.last_name, d.department_name
FROM employee e
JOIN employeeRole er ON e.role_id = er.id
JOIN department d ON er.department_id = d.id
ORDER BY d.department_name;


/*View Employees by department*/
SELECT e.first_name, e.last_name, d.department_name
FROM employee e
JOIN employeeRole er ON e.role_id = er.id
JOIN department d ON er.department_id = d.id
ORDER BY d.department_name


