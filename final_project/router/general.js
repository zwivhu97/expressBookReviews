const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ================= TASK 6 =================
// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User registered successfully" });
});


// ================= TASK 1 =================
// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


// ================= TASK 2 =================
// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// ================= TASK 3 =================
// Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};

    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});


// ================= TASK 4 =================
// Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};

    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result[key] = books[key];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


// ================= TASK 5 =================
// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn] && Object.keys(books[isbn].reviews).length > 0) {
        return res.status(200).json({ reviews: books[isbn].reviews });
    } else {
        return res.status(200).json({ message: "No reviews found for this book." });
    }
});


// ================= TASK 10 =================
// Get all books using async/await
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


// ================= TASK 11 =================
// Get book by ISBN using async
public_users.get('/asyncbooks/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});


// ================= TASK 12 =================
// Get books by author using async
public_users.get('/asyncbooks/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});


// ================= TASK 13 =================
// Get books by title using async
public_users.get('/asyncbooks/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});


module.exports.general = public_users;