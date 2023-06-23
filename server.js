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



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  promptUser()