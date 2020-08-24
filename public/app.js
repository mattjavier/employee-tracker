const { prompt } = require('inquirer')

const addDepartment = () => {
  prompt({
    type: 'input',
    name: 'departmentName',
    message: 'What is the name of the department?'
  })
  .then(({ departmentName }) => {

  })
  .catch(err => console.log(err))
}

const addRole = () => {
  prompt({
    type: 'input',
    name: 'roleTitle',
    message: 'What is the title of the role?'
  })
  .then(({ roleTitle }) => {

  })
  .catch(err => console.log(err))
}

const addEmployee = () => {

} 

const viewDepartments = () => {

}

const viewRoles = () => {

}

const viewEmployees = () => {

}

const updateEmployeeRole = () => {

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