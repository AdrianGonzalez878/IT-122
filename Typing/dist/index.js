var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import { Book } from './models/book.js'; // Ensure this file exists and is correctly defined
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to MongoDB (Make sure to use your connection URL)
mongoose.connect('mongodb://127.0.0.1:27017/booksDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json()); // Enable JSON request body parsing
app.use(cors()); // Enable CORS for frontend requests
// Get all books in JSON format
app.get('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book.find();
        res.json(books);
    }
    catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({ error: 'Error getting books' });
    }
}));
// Get book details by ID
app.get('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    }
    catch (error) {
        console.error('Error getting book:', error);
        res.status(500).json({ error: 'Error getting book' });
    }
}));
// Create or update a book
app.post('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body); // Verifica que los datos están llegando correctamente
        const { _id, title, author, publicationdate, inStore } = req.body;
        if (!title || !author || !publicationdate) {
            return res.status(400).json({ error: 'Required data is missing' });
        }
        let book;
        if (_id) {
            book = yield Book.findByIdAndUpdate(_id, { title, author, publicationdate, inStore }, { new: true });
        }
        else {
            book = new Book({ title, author, publicationdate, inStore });
            yield book.save();
        }
        res.json({ message: 'Book saved successfully', book });
    }
    catch (error) {
        console.error('Error saving book:', error);
        res.status(500).json({ error: 'Error saving book' });
    }
}));
// Ruta para actualizar un libro
app.put('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, publicationdate, inStore } = req.body;
        // Actualizar el libro en la base de datos usando el ID
        const updatedBook = yield Book.findByIdAndUpdate(req.params.id, // ID del libro
        { title, author, publicationdate, inStore }, // Datos a actualizar
        { new: true } // Devuelve el libro actualizado
        );
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully', book: updatedBook });
    }
    catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Error updating book' });
    }
}));
// Delete a book by ID
app.delete('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Book.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Error deleting book' });
    }
}));
// Render home.ejs with book data
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book.find();
        res.render('home', { books: JSON.stringify(books) });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}));
// Render book details page
app.get('/book/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book.findById(req.params.id);
        if (book) {
            res.render('detail', { book });
        }
        else {
            res.status(404).send('Book not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}));
// Start the server
app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`);
});
