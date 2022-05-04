INSERT INTO department (name)
VALUES
    ('HR'), ('Accounting'), ('Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Head Honcho', 100000, 1),
    ('Big Man', 150000, 2),
    ('Some poor person', 40000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Tommy', 'McGovern', 2, NULL),
    ('Ronald', 'Firbank', 1, 1),
    ('Virginia', 'Woolf', 1, 1),
    ('Piers', 'Gaveston', 1, 0),
    ('Charles', 'LeRoi', 2, 1),
    ('Katherine', 'Mansfield', 2, 1),
    ('Dora', 'Carrington', 3, 0),
    ('Edward', 'Bellamy', 3, 0),
    ('Montague', 'Summers', 3, 1),
    ('Octavia', 'Butler', 3, 1),
    ('Unica', 'Zurn', NULL, 1);