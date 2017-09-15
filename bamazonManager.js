const mysql = require('mysql');
const Tablefy = require('tablefy');
const inquirer = require('inquirer');
const table = new Tablefy();

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'S!th70rD',
  database: 'bamazon'
});

connection.connect(err => {
  if(err) throw err;
  main();
});

// connection.query("SELECT * FROM products", (err,res)=>{
//   table.draw(res);
// });

function main(){
  inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Menu',
      choices: [
        'Products For Sale',
        'Low Inventory',
        'Add to Inventory',
        'New Product'
      ]
    }
  ]).then((product)=>{
    switch (product.choice) {
      case 'Products For Sale':
        productsForSale();
        break;
      case 'Low Inventory':
        lowInventory();
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'New Product':
        newProduct();
        break;
      default:
        break;
    }

  });
}

function productsForSale(){
  connection.query("SELECT * FROM products", (err,res)=>{
    if(err) throw err;
    table.draw(res);
    connection.end();
  });
}

function lowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err,res)=>{
    if(err) throw err;
    if(res.length){
      table.draw(res);
    } else {
      console.log("No low inventory.");
    }
    connection.end();
  })
}

function addToInventory(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'What product(id)?'
    },
    {
      type: 'input',
      name: 'amount',
      message: 'How many?'
    }
  ]).then((answer)=>{
    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answer.amount,answer.id],(err, res)=>{
      if(err) throw err;
      productsForSale();
    })
  })
}

function newProduct(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Product Name',
    },
    {
      type: 'input',
      name: 'department',
      message: 'Department Name',
    },
    {
      type: 'input',
      name: 'price',
      message: 'Price',
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'Stock Quantity',
    }
  ]).then((answers)=>{
    connection.query("INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES(?,?,?,?)",[answers.name,answers.department,answers.price,answers.quantity], (err, res)=>{
        if(err) throw err;
        productsForSale();
    })
  });
}
