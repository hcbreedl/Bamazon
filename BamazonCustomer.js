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

var enteredUnits = 0;
var product = '';
var productString = '';
var amount = 0;
var price = 0;
var total = price * enteredUnits;
var newAmount = amount - enteredUnits;

var updateStock = function() {
	var userInput = [
			    {
			      type: 'input',
			      name: 'confirm',
			      message: 'Are you sure you want to make this purchase?',
			      default: 'y/n'
			    }
	];
	inquirer.prompt(userInput, function(answers) {
			}).then(function (answers) {
				if (answers.confirm == 'y') {
					update();
				}
			});
};

var update = function () {
	connection.query('UPDATE Products SET ? WHERE ?', [{
	   	StockQuantity: 30
	}, {ProductName: 'snacks'}], function(err, res) {
		if (err) throw err;
		console.log('success!');
	});
}

var userEntry = function() {
	connection.query('SELECT * FROM Bamazon.Products', function (err, results) {
			if (err) throw err;
			// console.log(results);

			var userInput = [
			    {
			      type: 'input',
			      name: 'item',
			      message: 'What item would you like to buy?',
			      default: ''
			    },
			    {
			      type: 'input',
			      name: 'units',
			      message: 'How many units would you like?',
			      default: ''
			    }
			];	

			inquirer.prompt(userInput, function(answers) {
			}).then(function (answers) {
				console.log('------------------------------');
				console.log('Thank you for your submission.');
				console.log('------------------------------');

				enteredUnits = answers.units;

				for(i = 0; i < results.length; i++) {
					if ((answers.item) == (results[i].ProductName) && (results[i].StockQuantity > 0)) {
						product = results[i].ProductName;
						productString = JSON.stringify(results[i].ProductName);
						amount = results[i].StockQuantity;
						price = results[i].Price;
						total = price * enteredUnits;
						newAmount = amount - enteredUnits;
				
						console.log('You purchased: ', results[i].ProductName);
						console.log('Previous Amount: ', amount);
						console.log('New Amount: ', newAmount);
						console.log('Total cost of purchase: $' + total);

						

						// connection.query('UPDATE Products SET ? WHERE ?', [{
						// 	   	StockQuantity: newAmount
						// 	}, {ProductName: productString}], function(err, res) {
						// 		if (err) throw err;
						// 		console.log('success!');
						// 	});

						// connection.query('UPDATE Products SET ? WHERE ?', [{
						//    	StockQuantity: 50
						// }, {ProductName: 'snacks'}], function(err, res) {
						// 	if (err) throw err;
						// 	console.log('success!');
						// });

						updateStock();


					} else if ((answers.item) == (results[i].ProductName) && (results[i].StockQuantity <= 0)) {
						console.log('Insufficient Inventory!');
					};
				};

			});	
		});
}

userEntry();
// update();

connection.end(function (err) {
	if (err) throw err;
});