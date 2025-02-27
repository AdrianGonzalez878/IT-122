'use strict';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Book } from './models/book.js';  // Importamos el modelo Book
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const cors = require('cors');


app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(cors()); // 📌 Habilita CORS para todas las solicitudes


app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books); // 📌 Devuelve todos los libros en formato JSON
  } catch (error) {
    console.error('Error getting books::', error);
    res.status(500).json({ error: 'Error getting books:' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'book not found' });
    }

    res.json(book); // 📌 Devuelve el libro en JSON
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ error: 'Error getting book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'book not found' });
    }

    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { _id, title, author, publicationDate } = req.body;

    if (!title || !author || !publicationDate) {
      return res.status(400).json({ error: 'Required data is missing' });
    }

    let book;
    if (_id) {
      // 📌 Actualiza si el ID existe
      book = await Book.findByIdAndUpdate(_id, { title, author, publicationDate }, { new: true });
    } else {
      // 📌 Crea un nuevo libro si no hay ID
      book = new Book({ title, author, publicationDate });
      await book.save();
    }

    res.json({ message: 'Book saved successfully', book });
  } catch (error) {
    console.error('Error saving the book:', error);
    res.status(500).json({ error: 'Error saving the book' });
  }
});




// 📌 **Ruta Home `/` - Obtener TODOS los libros desde MongoDB**
app.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // Obtener todos los libros
    res.render('home', { books }); // Pasar libros a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the server');
  }
});

app.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Buscar libro por ID
    if (book) {
      res.render('detail', { book });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the server');
  }
});

// 📌 Ruta DELETE para eliminar un libro y redirigir al home
app.get('/delete/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send('Book not Found');  // 📌 Usamos `return` para evitar ejecutar más código
    }

    console.log(`Book Deleted: ${result.title}`);
    res.redirect('/');  // 📌 Redirige al home solo si el libro fue eliminado
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('❌ Server error occurred while trying to delete the book');
  }
});





app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});


app.listen(app.get('port'), () => {
  console.log(' Server running in http://localhost:' + app.get('port'));
});
