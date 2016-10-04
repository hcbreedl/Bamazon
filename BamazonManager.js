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

var departments = [];
var getDepartments = function() {
	connection.query('SELECT * FROM Bamazon.Products', function (err, results) {
			if (err) throw err;
			// console.log(results);

			for(i = 0; i < results.length; i++) {
				departments.push(results[i].DepartmentName);
				//problem to solve later-- prints department name more than once if necessary in loop.
			};
		});
};
// getDepartments();

var listSelect = [
	    {
		  type: "list",
		  name: "departments",
		  message: "Select a department: ",
		  choices: [
		    "View Products for Sale",
		    "View Low Inventory",
		    "Add to Inventory",
		    "Add New Product"
		   ]
		}
	];
inquirer.prompt(listSelect, function(answers) {
			}).then(function (answers) {
				if (answers.departments == 'View Products for Sale') {
					console.log('---------------');
					console.log('Electronics');
					console.log('Furniture');
					console.log('Food');
					console.log('---------------');
				} else if (answers.departments == 'Add New Product') {
					// connection.query('UPDATE Products SET ? WHERE ?', [
					// {StockQuantity: 3000}, {ProductName: 'snacks'}], function(err, res) {
					// 	if (err) throw err;
					// 	console.log('success!');
					// });
					console.log('new product addition');
				} else if (answers.departments == 'View Low Inventory') {
					console.log('low Inventory viewed');
				} else if (answers.departments == 'Add to Inventory') {
					console.log('added to Inventory');
				}
			});

connection.end(function (err) {
	if (err) throw err;
});

