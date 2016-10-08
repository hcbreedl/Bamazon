var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'Bamazon'
});

connection.connect(function (err){
	if (err) throw err;
	// console.log('connected as id', connection.threadId);
});

var productSelection = '';
var amountToBuy = 0;

// Function to end program
var end = function() {
	connection.end(function (err) {
		if (err) throw err;
	});
};

// Function to log out 'Welcome to bamazon' and list of inventory
var bamazon = function() {
	console.log('-----------------------------------------');
	console.log('---------- Welcome To BAMAZON! ----------');
	console.log('- Products to purchase/Stock Quantities -');
	console.log('-----------------------------------------');

	connection.query('SELECT * FROM Products', function(err, res) {
		if (err) throw err;
		for(i=0; i<res.length; i++) {
			
			console.log('Product ', i+1 + ': ', res[i].ProductName);
			console.log('Stock Quantity: ', res[i].StockQuantity);
			console.log('-----------------------------------------');
		}
	// Function to make purchase from Bamazon
	userEntry();
	})
};

// Function prompting if user is ready
var welcome = function() {
	var welcomeList = [
		{
	      type: 'input',
	      name: 'ready',
	      message: 'Ready to make a purchase?',
	      default: 'y/n'
	    }
	];
	inquirer.prompt(welcomeList)
		.then(function (answers) {
			// Upon user selecting 'y' a list of all products and current stock quantity are listed.
			if (answers.ready == 'y') {	
				bamazon();	
			} else {
				console.log('');
				console.log('     Have a great day!');
				console.log('');
			}
		});
};

// Purchase/Update function
var userEntry = function() {
	var productSelect = [{
	  type: "input",
	  name: "products",
	  message: "Select a product to purchase: ",
	  default: ''
	},
	{
      type: 'input',
      name: 'amount',
      message: 'How many would you like?',
      default: ''
    }];

    //Prompts user for which product to purchase and then how many they would like to purchase.
	inquirer.prompt(productSelect)
		.then(function (answers) {
			productSelection = answers.products;
			amountToBuy = answers.amount;
			var inStock = 0;
			var adjust = 0;
			var price = 0;

			// Read: necessary to get the proper price for selected item
			connection.query('SELECT * FROM Products', function(err, res) {
				if (err) throw err;

				for(i=0; i < res.length; i++) {
					if ((productSelection == res[i].ProductName) && (res[i].StockQuantity > amountToBuy)) {
						
						inStock = res[i].StockQuantity;
						adjust = inStock - amountToBuy;
						price = res[i].Price * amountToBuy;

						//Update stock to Bamazon
						connection.query('UPDATE Products SET StockQuantity = ' + adjust + ' WHERE ProductName = ?', [""+productSelection+""], function(err, res) {
							if (err) throw err;
							console.log('');
							console.log('     Successful Purchase!');
							console.log('     Purchase Total: ', price);
							console.log('');
							end();
						});
					} else if ((productSelection == res[i].ProductName) && (res[i].StockQuantity < amountToBuy)) {
						console.log('');
						console.log('     Insufficient Inventory!');
						console.log('');
						end();
					}
				}
			})
	});
};

//Runs initial prompt
welcome();



