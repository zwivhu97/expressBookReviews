const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// check if username is valid (not already used)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// check login credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// LOGIN
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({ message: "Login successful!" });
});

// ADD / MODIFY REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;