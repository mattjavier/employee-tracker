const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:JaJ012566m@localhost/employee_db')

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

const addRole = () => {
  db.query ('SELECT * FROM department', (err, departments) => {
    if (err) { console.log(err) }

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

const addEmployee = () => {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query('SELECT * FROM employee', (err, employees) => {

      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

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

const viewDepartments = () => {
  db.query(`
    SELECT * FROM department
  `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    start()
  })
}

const viewRoles = () => {
  db.query(`
    SELECT role.title, role.salary FROM role
  `, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    start()
  })
}

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

const updateEmployeeRole = () => {
  db.query(`
    SELECT employee.name FROM employee
  `, (err, employees) => {
    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))

    
  })
}

const updateEmployeeManager = () => {

}
 
const viewEmployeesByManager = () => {

}

const deleteDepartment = () => {

}

const deleteRole = () => {

}

const deleteEmployee = () => {

}

const viewBudget = () => {

}

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