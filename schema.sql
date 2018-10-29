-- Drops the favorite_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "favorite_db" database --
CREATE DATABASE bamazon_db;

-- Make it so all of the following code will affect favorite_db --

CREATE TABLE products (
  Item_ID INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL (5,3),
  stock_quantity INT(20)
  PRIMARY KEY (Item_ID)
);
