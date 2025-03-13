// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "harsh7488",
//   database: "attendance_system",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL");
//     connection.release();
//   }
// });

// module.exports = pool;


// Clever Cloud MySQL Connection

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,      // Clever Cloud DB Host
  user: process.env.MYSQL_ADDON_USER,      // Clever Cloud DB User
  password: process.env.MYSQL_ADDON_PASSWORD, // Clever Cloud DB Password
  database: process.env.MYSQL_ADDON_DB,    // Clever Cloud DB Name
  port: process.env.MYSQL_ADDON_PORT,      // Clever Cloud DB Port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL on Clever Cloud");
    connection.release();
  }
});

module.exports = pool;