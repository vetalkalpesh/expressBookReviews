
const express = require('express');
const axios = require('axios');
const router = express.Router();
const books = require('./booksdb.js');

const general = router;

// Promise-based asynchronous retrieval
const getBookList = () => Promise.resolve(books);

const getBookByISBN = (isbn) =>
    Promise.resolve(books[isbn] || null);

const getBooksByAuthor = (author) =>
    Promise.resolve(
        Object.values(books).filter(
            book => book.author.toLowerCase().includes(author.toLowerCase())
        )
    );

const getBooksByTitle = (title) =>
    Promise.resolve(
        Object.values(books).filter(
            book => book.title.toLowerCase().includes(title.toLowerCase())
        )
    );

// Get all books
general.get('/', async (req, res) => {
    try {
        const result = await getBookList();
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get book by ISBN
general.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        return res.json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get books by author
general.get('/author/:author', async (req, res) => {
    try {
        const result = await getBooksByAuthor(req.params.author);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get books by title
general.get('/title/:title', async (req, res) => {
    try {
        const result = await getBooksByTitle(req.params.title);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get reviews
general.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book.reviews || {});
});

module.exports = { general };
