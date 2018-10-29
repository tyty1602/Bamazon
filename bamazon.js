// Load the NPM Package inquirer
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

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

//Return specific Artist
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
    });

}

//The app should then prompt users with two messages.



// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.



// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.



// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// However, if your store does have enough of the product, you should fulfill the customer's order.


// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.