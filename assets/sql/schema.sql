DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE TABLE employee_db.department(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE employee_db.employeeRole(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES employee_db.department(id) 
);

CREATE TABLE employee_db.employee(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES employee_db.employeeRole(id),
    manager_id INT NULL,
    FOREIGN KEY (manager_id) REFERENCES employee_db.employee(id) 
);
