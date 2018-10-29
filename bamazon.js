// Load the NPM Package inquirer
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var store_array = [];

// instantiate
var table = new Table({
    head: ['Item_ID', 'product_name', 'Price'],
    colWidths: [20, 50, 50]
});



var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayStock();
});

function displayStock() {
    connection.query('SELECT * FROM `products` WHERE `stock_quantity` > 0', function (error, res, fields) {
        //console.log(res)
        var array1 = res;
        array1.forEach(function (element) {
            console.log(element.Item_ID);
            console.log(element.product_name);
            console.log(element.price);
            table.push(
                [element.Item_ID, element.product_name, element.price]
            );
        });
        console.log(table.toString());
        store_array.push(array1);
    });

}

//The app should then prompt users with two messages.


// prompt for info about the item being put up for auction

// 1. Yes or no would you like to purchase an item
// 2. If no, end the conversation
// 3. If yes, ask which item the buyer want and display the list of the items. 
// 4. When buy select one, ask them how many they want to buy
//5.  validate if item is in stock
// 6. If not in stock, display sorry message
//7. If in stock, display a confirm message with total price

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "buyOrNot",
            type: "rawlist",
            message: "Would you like to buy an item?",
            choices: ["Yes", "No"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.buyOrNot.toUpperCase() === "YES") {
                buy();
            }
            else {
                console.log("Thank you for checking out our store!");
            }
        });
}

function buy() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_name);
                        }
                        return choiceArray;
                    },
                    message: "What auction would you like to buy?"
                },
                {
                    name: "buy",
                    type: "input",
                    message: "How many items would you like to buy?"
                }
            ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                  if (results[i].item_name === answer.choice) {
                    chosenItem = results[i];
                  }
                }
        
                // determine if bid was high enough
                if (chosenItem.highest_bid < parseInt(answer.bid)) {
                  // bid was high enough, so update db, let the user know, and start over
                  connection.query(
                    "UPDATE auctions SET ? WHERE ?",
                    [
                      {
                        highest_bid: answer.bid
                      },
                      {
                        id: chosenItem.id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Bid placed successfully!");
                      start();
                    }
                  );
                }
                else {
                  // bid wasn't high enough, so apologize and start over
                  console.log("Your bid was too low. Try again...");
                  start();
                }
              });
          });
        }