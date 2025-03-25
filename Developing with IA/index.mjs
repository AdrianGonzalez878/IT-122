import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Book } from './models/book.js'; // Asegúrate de que tienes el modelo de libro
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las solicitudes

// Ruta para obtener todos los libros en formato JSON
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Error getting books' });
  }
});

// Ruta para obtener detalles de un libro en particular (en formato JSON)
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book); // Devuelve el libro en formato JSON
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ error: 'Error getting book' });
  }
});

// Ruta para crear un nuevo libro o actualizar uno existente
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, publicationDate, inStore } = req.body;

    if (!title || !author || !publicationDate) {
      return res.status(400).json({ error: 'Required data is missing' });
    }

    let book;
    if (req.body._id) {
      // Si hay un ID, actualizamos el libro
      book = await Book.findByIdAndUpdate(req.body._id, { title, author, publicationDate, inStore }, { new: true });
    } else {
      // Si no hay ID, creamos un nuevo libro
      book = new Book({ title, author, publicationDate, inStore });
      await book.save();
    }

    res.json({ message: 'Book saved successfully', book });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Error saving book' });
  }
});

// Ruta para eliminar un libro
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

// Ruta para mostrar la lista de libros en la página principal
app.get('/', async (req, res) => {
  try {
    const books = await Book.find(); 
    res.render('home', { books: JSON.stringify(books) }); // Pasamos los libros a home.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the server');
  }
});

// Ruta para mostrar los detalles de un libro en particular
app.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Buscar libro por ID
    if (book) {
      res.render('detail', { book }); // Mostrar el detalle en la vista de detalles
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in the server');
  }
});

// Escuchar en el puerto
app.listen(app.get('port'), () => {
  console.log('Server running on http://localhost:' + app.get('port'));
});
