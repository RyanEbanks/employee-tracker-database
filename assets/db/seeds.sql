INSERT INTO employee_db.department(department_name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO employee_db.employeeRole(title, salary, department_id)
VALUES
("Salesperson", 80000, 1),
("Sales Lead", 100000, 1),
("Software Engineer", 150000, 2),
("Lead Engineer", 120000, 2),
("Accountant", 125000, 3),
("Accountant Manager", 160000, 3),
("Lawyer", 190000, 4),
("Legal Team Lead", 250000, 4);

/*Need to add role and manager id to get the correct references to view all roles*/
INSERT INTO employee_db.employee(first_name, last_name, role_id)
VALUES
("Matthew", "Brown", 1),
("Mark", "White", 1),
("Luke", "Reid", 2),
("John", "Johnson", 2),
("Abraham", "Davis", 3),
("Noah", "Garcia", 3),
("Adam", "Miller", 4),
("David", "Jones", 4);



