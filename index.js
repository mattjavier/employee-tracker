const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

// mysql connection to database
const db = mysql.createConnection('mysql://root:JaJ012566m@localhost/employee_db')

// add a department to department table
const addDepartment = () => {
  prompt({
    type: 'input',
    name: 'name',
    message: 'What is the name of the department?'
  })
  .then(department => {
    db.query('INSERT INTO department SET ?', department, (err) => {
      if (err) { console.log(err) }
      console.log('Department Created!')
      start()
    })
  })
  .catch(err => console.log(err))
}

// add a role to role table
const addRole = () => {

  // get all departments in order to select a department for the role
  db.query ('SELECT * FROM department', (err, departments) => {
    if (err) { console.log(err) }

    // map department name to id
    departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))

    prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this role?'
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Which department does this role belong to?',
        choices: departments
      }
    ])
    .then(role => {
      db.query('INSERT INTO role SET ?', role, (err) => {
        if (err) { console.log(err) }
        console.log('Role Created!')
        start()
      })
    })
    .catch(err => console.log(err))
  })
}

// add employee to employee table
const addEmployee = () => {
  
  // get all roles for employee
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }

    // map role title to id
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    // get all employees to select a manager
    db.query('SELECT * FROM employee', (err, employees) => {

      // map employee full name to id
      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      // give an option for no manager
      employees.unshift({ name: 'None', value: null })

      prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the employee first name?'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the employee last name?'
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose a role for the employee:',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Choose a manager for the employee:',
          choices: employees
        }
      ])
      .then(employee => {
        db.query('INSERT INTO employee SET ?', employee, (err) => {
          if (err) { console.log(err) }
          console.log('Employee Created!')
          start()
        })
      })
      .catch(err => { console.log(err) })
    })
  })
} 

// view all departments
const viewDepartments = () => {
  db.query(`
    SELECT name FROM department
  `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    start()
  })
}

// view all roles
const viewRoles = () => {
  db.query(`
    SELECT role.title, role.salary FROM role
  `, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    start()
  })
}

// view al employees
const viewEmployees = () => {
  db.query(`
    SELECT employee.id, employee.first_name, employee.last_name,
      role.title, role.salary, department.name AS department, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id 
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id
  `, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    start()
  })
}

// update the role id for an employee
const updateEmployeeRole = () => {

  // get all roles to choose from
  db.query(`SELECT * FROM role`, (err, roles) => {
    if (err) { console.log(err) }

    // map role title to id
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    // get all employees to select from
    db.query(`
      SELECT * FROM employee`, (err, employees) => {
      if (err) { console.log(err) }

      // map employee full name to id
      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Which employee would you like to update?',
          choices: employees
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Which role would you like to select?',
          choices: roles
        }
      ])
      .then(({ employee_id, role_id }) => {
        db.query(`
          UPDATE employee
          SET role_id = ?
          WHERE id = ?
        `, [role_id, employee_id], err => {
          if (err) { console.log(err) }
          console.log('Employee Role Updated!')
          start()
        })
      })
      .catch(err => { console.log(err) })  
    })
  })
}

// update manager id for a selected employee
const updateEmployeeManager = () => {

  // get all employees
  db.query(`SELECT * FROM employee`, (err, employees) => {
    if (err) { console.log(err) }

    // map full name to id
    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))

    // create managers array to be the same as employees 
    let managers = employees 

    // give an option for no manager
    managers.unshift({ name: 'None', value: null })

    prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Which employee would you like to update?',
        choices: employees
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Who would you like to choose as their new manager?',
        choices: managers
      }
    ])
    .then(({ employee_id, manager_id }) => {
      db.query(`
        UPDATE employee
        SET manager_id = ?
        WHERE id = ?
      `, [manager_id, employee_id], err => {
        if (err) { console.log(err) }
        console.log('Employee Manager Updated!')
        start()
      })
    })
    .catch(err => { console.log(err) })
  })
}

// view employees by their manager
const viewEmployeesByManager = () => {

  // get all managers, only distinct values, no repeats
  db.query(`
    SELECT DISTINCT manager.id, CONCAT(manager.first_name, ' ', manager.last_name) AS name FROM employee
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id;
  `, (err, managers) => {
    if (err) { console.log(err) }

    // map name to id
    managers = managers.map(manager => ({
      name: manager.name,
      value: manager.id
    }))

    // take out null values if any
    managers = managers.filter(manager => manager.name !== null)

    prompt({
      type: 'list',
      name: 'manager_id',
      message: 'Whose employees would you like to see?',
      choices: managers
    })
    .then(({ manager_id }) => {
      db.query(`
        SELECT * FROM employee
        WHERE manager_id = ?
      `, manager_id, (err, employees) => {
        if (err) { console.log(err) }
        console.table(employees)
        start()
      })
    })
  })
}


// remove a department from department table
const deleteDepartment = () => {

  // get all departments
  db.query(`SELECT * FROM department`, (err, departments) => {
    if (err) { console.log(err) }

    // map name to id
    departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))

    prompt({
      type: 'list',
      name: 'department_id',
      message: 'Which department would you like to delete?',
      choices: departments
    })
    .then(({ department_id }) => {
      db.query(`
        DELETE FROM department
        WHERE id = ?
      `, department_id, err => {
        if (err) { console.log(err) }
        console.log('Department Deleted!')
        start()
      })
    })
    .catch(err => { console.log(err) })
  })
}

// remove a role from role table
const deleteRole = () => {

  // get all roles
  db.query(`SELECT * FROM role`, (err, roles) => {
    if (err) { console.log(err) }

    // map role to id
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    prompt({
      type: 'list',
      name: 'role_id',
      message: 'Which role would you like to delete?',
      choices: roles
    })
    .then(({ role_id }) => {
      db.query(`
        DELETE FROM role
        WHERE id = ?
      `, role_id, err => {
        if (err) { console.log(err) }
        console.log('Role Deleted!')
        start()
      })
    })
    .catch(err => { console.log(err) })
  })
}

// remove an employee from employee table
const deleteEmployee = () => {

  // get all employees
  db.query(`SELECT * FROM employee`, (err, employees) => {
    if (err) { console.log(err) }

    // map name to id
    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))

    prompt({
      type: 'list',
      name: 'employee_id',
      message: 'Which employee would you like to delete?',
      choices: employees
    })
    .then(({ employee_id }) => {
      db.query(`
        DELETE FROM employee
        WHERE id = ?
      `, employee_id, err => {
        if (err) { console.log(err) }
        console.log('Employee Deleted!')
        start()
      })
    })
    .catch(err => { console.log(err) })
  })
}

// view total utilized budget for a department
const viewBudget = () => {

  // get all departments to choose from
  db.query(`SELECT * FROM department`, (err, departments) => {
    if (err) { console.log(err) }

    // map name to id
    departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))

    prompt({
      type: 'list',
      name: 'department_id',
      message: 'Which department budget would you like to view?',
      choices: departments
    })
    .then(({ department_id }) => {

      // get the sum of the column role.salary in a given department for all employees
      db.query(`
        SELECT SUM(role.salary) as budget
        FROM employee 
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department 
        ON role.department_id = department.id
        WHERE department.id = ?
      `, department_id, (err, res) => {
        if (err) { console.log(err) }
        if (res[0].budget !== null) {
          console.log(`The total utilized budget for this department is $${res[0].budget}`)
        } else {
          console.log(`The total utilized budget for this department is $0`)
        }
        start()
      })
    })
    .catch(err => { console.log(err) })
  })
}

// start function: prompt user for initial action
const start = () => {
  prompt([
    {
      type: 'list', 
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Add Department',
          value: 'addDepartment'
        }, 
        { 
          name: 'Add Role',
          value: 'addRole'
        },
        {
          name: 'Add Employee',
          value: 'addEmployee'
        },
        {
          name: 'View Departments',
          value: 'viewDepartments'
        },
        {
          name: 'View Roles',
          value: 'viewRoles'
        },
        {
          name: 'View Employees',
          value: 'viewEmployees'
        },
        {
          name: 'Update Employee Role',
          value: 'updateEmployeeRole'
        },
        {
          name: 'Update Employee Manager',
          value: 'updateEmployeeManager'
        },
        {
          name: 'View Employees by Manager',
          value: 'viewEmployeesByManager'
        },
        {
          name: 'Delete Department',
          value: 'deleteDepartment'
        },
        {
          name: 'Delete Role',
          value: 'deleteRole'
        },
        {
          name: 'Delete Employee',
          value: 'deleteEmployee'
        },
        {
          name: 'View Department Budget',
          value: 'viewBudget'
        }
      ]
    }
  ])
  .then(({ choice }) => {
    switch (choice) {
      case 'addDepartment':
        addDepartment()
        break
      case 'addRole':
        addRole()
        break
      case 'addEmployee':
        addEmployee()
        break
      case 'viewDepartments':
        viewDepartments()
        break
      case 'viewRoles':
        viewRoles()
        break
      case 'viewEmployees':
        viewEmployees()
        break
      case 'updateEmployeeRole':
        updateEmployeeRole()
        break
      case 'updateEmployeeManager':
        updateEmployeeManager()
        break
      case 'viewEmployeesByManager':
        viewEmployeesByManager()
        break
      case 'deleteDepartment':
        deleteDepartment()
        break
      case 'deleteRole':
        deleteRole()
        break
      case 'deleteEmployee':
        deleteEmployee()
        break
      case 'viewBudget':
        viewBudget()
        break
    }
  })
  .catch(err => console.log(err))
}

start()