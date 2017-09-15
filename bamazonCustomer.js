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
      type: 'input',
      name: 'choice',
      message: 'Product ID:'
    }
  ]).then((product)=>{
    connection.query("SELECT product_name,stock_quantity,price FROM products WHERE item_id = ?",[product.choice], (err,res)=>{
      table.draw(res);
      inquirer.prompt([
        {
          type: 'input',
          name: 'choice',
          message: 'Amount:'
        }
      ]).then((amount)=>{
        if(amount.choice <= res[0].stock_quantity){
          connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",[amount.choice,product.choice], ()=>{
            if(err) throw err;
            console.log(`You bought ${amount.choice} at $${res[0].price*amount.choice}`);
          });
        } else {
          console.log(`There are not that many to buy.`);
        }
        connection.end();
      });
    });
  });
}
