const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user. Username and password required." });
});

// Get the book list available in the shop


function getBooks() {
    axios.get('http://localhost:5000/')
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 4));
        })
        .catch((error) => {
            console.log("Error fetching books: ", error.message);
        });
}

getBooks();

// Get book details based on ISBN
function getBookByISBN(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 4));
        })
        .catch((error) => {
            console.log("Error fetching book by ISBN: ", error.message);
        });
}

getBookByISBN(1);
  
// Get book details based on author
function getBooksByAuthor(author) {
    axios.get(`http://localhost:5000/author/${author}`)
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 4));
        })
        .catch((error) => {
            console.log("Error fetching books by author: ", error.message);
        });
}

getBooksByAuthor("Chinua Achebe");

// Get all books based on title
function getBooksByTitle(title) {
    axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 4));
        })
        .catch((error) => {
            console.log("Error fetching books by title: ", error.message);
        });
}

getBooksByTitle("Things Fall Apart");

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found for this ISBN" });
    }
});

module.exports.general = public_users;
