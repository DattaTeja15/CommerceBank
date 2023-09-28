import express from "express";
import mysql from "mysql";
import cors from "cors"; // Import the 'cors' middleware

const app = express();

app.use(cors());
app.use(express.json());
// Use the 'cors' middleware to enable CORS

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Datta@1503",
  database: "test",
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error occurred while registering." });
      } else {
        console.log("Registration successful!");
        res.status(200).json({ message: "Registration successful!" });
      }
    }
  );
});

app.listen(8888, () => {
  console.log("Connected to App!");
});
