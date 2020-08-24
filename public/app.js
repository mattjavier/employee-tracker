const { prompt } = require('inquirer')

const start () => {
  prompt([
    {
      type: 'list', 
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['Add department', 'Add role', 'Add employee', 'View departments', 'View roles', 'View employees', 'Update employee roles']
    }
  ])
  .then(({ choice }) => {
    console.log(choice)
    // switch (choice) {
    //   case 'Add department':
    //     break
    //   case 'Add role':
    //     break
    //   case 'Add employee':
    //     break
    //   case 'View departments':
    //     break
    //   case 'View roles':
    //     break
    //   case 'View employees':
    //     break
    //   case 'Update employee roles':
    //     break
    // }
  })
  .catch(err => console.log(err))
}

start()