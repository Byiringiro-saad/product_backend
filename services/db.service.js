const dotenv = require("dotenv");
const mysql = require("mysql2");

// database environment variables
dotenv.config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// create the connection to database
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

// connect to database
connection.connect((err) => {
  if (err) throw err;

  // create tables
  createTablesIfNotExist(connection);

  // create procedures
  createProcedures(connection);
});

// Make db calls
export const dbCall = (procName, procParams, callback) => {
  // build query
  const query = `CALL ${procName}(${procParams.map((_) => "?").join(",")})`;
  const values = [...procParams];

  // execute query
  connection.query(query, values, callback);
};

// create tables
const createTablesIfNotExist = (connection) => {
  const createTableQueries = [
    // create products table
    `CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description VARCHAR(1000) NULL,
          price INT NOT NULL
      )`,
    // create users table
    `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
      )`,
  ];

  // check tables
  connection.query("SHOW TABLES", (err, results) => {
    if (err) throw err;

    // exit if all tables exist
    if (results.length > 0) return;

    // create tables
    createTableQueries.forEach((query) => {
      connection.query(query, (err) => {
        if (err) {
          console.error(`Error creating table:`, err);
        } else {
          console.log(`Table created successfully`);
        }
      });
    });
  });
};

// create procedures
const createProcedures = (connection) => {
  const procedures = [
    // change delimiter to create procedure
    `
    DELIMITER//
    `,

    // insert product procedure
    `
    CREATE PROCEDURE usp_ins_product(IN name VARCHAR(255), IN description TEXT, IN price DECIMAL(10,2))
    BEGIN
        INSERT INTO products (name, description, price) VALUES (name, description, price);
    END;
    `,

    // get product procedure
    `
    CREATE PROCEDURE usp_get_product(IN product_id INT)
    BEGIN
        SELECT * FROM products WHERE id = product_id;
    END;
    `,

    // list products procedure
    `
    CREATE PROCEDURE usp_list_product()
    BEGIN
        SELECT * FROM products;
    END;
    `,

    // update product procedure
    `
    CREATE PROCEDURE usp_upd_product(IN product_id INT, IN name VARCHAR(255), IN description TEXT, IN price DECIMAL(10,2))
    BEGIN
        UPDATE products SET name = name, description = description, price = price WHERE id = product_id;
    END;
    `,

    // delete product procedure
    `
   CREATE PROCEDURE usp_del_product(IN product_id INT)
   BEGIN
       DELETE FROM products WHERE id = product_id;
   END;
   `,

    `
    DELIMITER;
    `,
  ];

  // check procedures
  connection.query(
    "SHOW PROCEDURE STATUS WHERE Db = ?",
    [connection.config.database],
    (err, results) => {
      if (err) throw err;

      const existingProcedures = results.map((proc) => proc.Name);

      // exit if all procedures exist
      if (existingProcedures.length > 0) return;

      procedures.forEach((procedureSql) => {
        connection.query(procedureSql, (err) => {
          if (err) {
            console.error(`Error creating procedure`, err);
          } else {
            console.log(`Procedure created successfully`);
          }
        });
      });
    }
  );
};

module.exports = connection;
