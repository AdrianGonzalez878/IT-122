import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAll, getItem } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// main
app.get('/', (req, res) => {
  const plants = getAll();
  res.render('home', { plants });
});

// details
app.get('/detail', (req, res) => {
  const id = parseInt(req.query.id);
  const plant = getItem(id);
  if (plant) {
    res.render('detail', { plant });
  } else {
    res.status(404).send('Plant not Found');
  }
});

// Server
app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});