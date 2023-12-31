const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo")
const PORT = process.env.PORT || 3003;
const app = express();
require("console.table")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "employees_db"
      },
      console.log(`Connected to employees_db database.`)
    );

    function promptUser(){
const logoText = logo({
    name: "Alex is the boss"
}).render()
console.log(logoText)
inquirer.prompt([
    {
        type: "list",
        name: "openingMessage",
        message: "What would you like to do?",
        choices: [
          "viewAllEmployees",
          "viewAllDepartments",
          "viewAllRoles",
          "addADepartment",
          "addARole",
          "addAEmployee",
          "quit",
        ],
    }
]).then((userAnswers)=>{
    let choice = userAnswers.openingMessage;
    switch(choice){
        case "viewAllEmployees":
            viewAllEmployees()
            break;
            case "viewAllDepartments":
            viewAllDepartments();
            break;
          case "viewAllRoles":
            viewAllRoles();
            break;
          case "addADepartment":
            addADepartment();
            break;
          case "addARole":
            addARole();
            
            break;
          case "addAEmployee":
            addAEmployee();
            break;
          case "quit":
            quit();
            break;
            default:
                console.log("broken")
                break;
    }
})
    }

    function viewAllEmployees(){
        db.query("SELECT * FROM employee_list", function (err, results) {
           (err) ? console.log(err) :  console.table(results), promptUser();
        });
        
      }
      function viewAllDepartments(){
        db.query("SELECT * FROM department_list", function(err, results) {
          (err) ? console.log(err) : console.table(results), promptUser();
        });
      }
      
      function viewAllRoles(){
        db.query("SELECT * FROM role_list", function(err, results) {
          (err) ? console.log(err) : console.table(results), promptUser();
        })
      }
      function addADepartment() {
        inquirer.prompt([
          {
            type: "input",
            name: "addADepartment",
            message: "enter a department dood."
          }
        ]).then((inquirerResponse) => {
          console.log("department added:  " + inquirerResponse.addADepartment)
          let departmentName = inquirerResponse.addADepartment
          db.query(`INSERT INTO
                    department_list 
                    (dept_name) VALUES 
                    ('${departmentName}')`, function(err, results){
            (err) ? console.log(err) : console.table(`Added ${departmentName}!!!!`, results), promptUser()
          })
        }) 
    }
    
    function addARole() {  
      db.query("SELECT * FROM department_list", function(err, results) {
        if (err) {
          console.log(err);
          return workTime();
        }
        const departmentChoices = results.map(department => ({
          value: department.id,
          name: department.dept_name
        })); 
        inquirer.prompt([
          {
            type: "input",
            name: "addARole",
            message: "Enter a Role Dood."
          },
          {
            type: "input",
            name: "salary",
            message: "how much this joker making?"
          },
          {    
            type: "list",
            name: "deptId",
            message: "witch department does this belong to?",
            choices: departmentChoices        
          }
         
        ]).then((inquirerResponse)=> {
            console.log("Role added:  " + inquirerResponse.addARole)
            let departmentId = inquirerResponse.deptId;      
            let roleName = inquirerResponse.addARole;
            let roleSalary = inquirerResponse.salary;
            db.query(`INSERT INTO 
                     role_list
                     (title, salary, department_list_id) 
                     VALUES 
                     ('${roleName}', 
                    '${roleSalary}',
                    '${departmentId}')`, function(err, results){
              (err) ? console.log(err) : console.table(`Added:  ${roleName}!!!!`,results) , promptUser()
            })
          })    
        });
      
    }
    function addAEmployee() {
        db.query("SELECT * FROM role_list", function (err, results) {
          if (err) {
            console.log(err);
            return workTime();
          }
      
          const roleChoices = results.map(role => ({
            value: role.id,
            name: role.title
          }))
          ///inquirer
          inquirer.prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter an employee name dood."
            },
            {
              type: "input",
              name: "lastName",
              message: "enter an employee last name dood."
            },
            {
              type: "list",
              name: "roleId",
              message: "wich role are we adding this guy to.",
              choices: roleChoices
            }
          ]).then((inquirerResponse) => {
            console.log("dood added: " + inquirerResponse.roleId)
            let roleId = inquirerResponse.roleId;
            let empName = inquirerResponse.firstName;
            let empLast = inquirerResponse.lastName;
            db.query(`INSERT INTO employee_list 
                     (first_name, last_name, 
                      role_list_id) VALUES 
                      ('${empName}', 
                      '${empLast}', 
                      '${roleId}')`, function (err, results){
                        (err) ? console.log(err) : console.table(`Added:  ${empName}!!!!`,results) , promptUser()
                      })
                    })   
                  });   
                }
      
      function quit(){
        console.log("quitting you")
        process.exit()
      };
      
      app.use((req, res) => {
        res.status(404).end();
        });
      
    


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  promptUser()