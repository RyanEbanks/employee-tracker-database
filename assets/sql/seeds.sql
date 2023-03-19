INSERT INTO employee_db.department(department_name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO employee_db.employeeRole(title, salary)
VALUES
("Salesperson", 80000),
("Sales Lead", 100000),
("Software Engineer", 150000),
("Lead Engineer", 120000),
("Accountant", 125000),
("Accountant Manager", 160000),
("Lawyer", 190000),
("Legal Team Lead", 250000);

/*Need to add role and manager id to get the correct references to view all roles*/
INSERT INTO employee_db.employee(first_name, last_name)
VALUES
("Matthew", "Brown"),
("Mark", "White"),
("Luke", "Reid"),
("John", "Johnson"),
("Abraham", "Davis"),
("Noah", "Garcia"),
("Adam", "Miller"),
("David", "Jones");



