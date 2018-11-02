// Load the NPM Package inquirer
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var store_array = [];
var quantity_array = [];

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
    //console.log("connected as id " + connection.threadId + "\n");
    start();
    // displayStock();
});

function displayStock() {
    connection.query('SELECT * FROM `products` WHERE `stock_quantity` > 0', function (error, res, fields) {
        //console.log(res)
        var array1 = res;
        array1.forEach(function (element) {
            table.push(
                [element.Item_ID, element.product_name, element.price]
            );
        });
        console.log(table.toString());
        store_array.push(array1);
    });

}

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "buyOrNot",
            type: "rawlist",
            message: "Would you like to buy an item?",
            choices: ["YES", "NO"]
        })
        .then(function (answer) {
            // console.log("does buy trigger work?"+ answer)
            // based on their answer, either call the bid or the post functions
            if (answer.buyOrNot === "YES") {
                displayStock();
                buy();
                //console.log("function buy works?")
            } else {
                console.log("Thank you for checking out our store!");
            }
        });
}

function buy() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please select the Item ID which you would like to purchase.'
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?'
		}
	]).then(function(input) {
		var item = parseInt(input.item_id);
        var quantity = parseInt(input.quantity);

		connection.query('SELECT * FROM products WHERE Item_ID = ?',[item],function(err, data) {
			if (err) throw err;
            else {
                let parseData = JSON.stringify(data)
                let useThis = JSON.parse(parseData)
                
                //console.log('data array is heeeeeer' , useThis);
                //console.log("hello here we are", useThis[0].stock_quantity)
				// If the quantity requested by the user is in stock
				if (quantity <= useThis[0].stock_quantity) {
                    
					console.log('Yay, the product you requested is in stock! Placing order!');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (useThis[0].stock_quantity - quantity) + ' WHERE Item_Id = ' + item;

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
                        //console.log("stock quantity has been updated");
                        if (err) throw err;

                    })
                    connection.query('SELECT * FROM products WHERE Item_ID = ?',[item],function(err, data2) {
                        //console.log("this is data price final", data2);
                        let parsedata = JSON.stringify(data2);
                        let finalParsed = JSON.parse(parsedata);
                        if (err) throw err;
                       

						console.log('Your oder has been placed! Your total is $' + finalParsed[0].price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
					console.log('Sorry, we do not have enough.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");
					connection.end();
				}
			}
		})
	})
}

//Algorithm
//The app should then prompt users with two messages.


// prompt for info about the item being put up for auction

// 1. Yes or no would you like to purchase an item
// 2. If no, end the conversation
// 3. If yes, ask which item the buyer want and display the list of the items. 
// 4. When buy select one, ask them how many they want to buy
//5.  validate if item is in stock
// 6. If not in stock, display sorry message
//7. If in stock, display a confirm message with total price