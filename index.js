require('dotenv').config();
require('./mongo');
const express = require('express');
const cors = require('cors');
const Note = require('./models/Note');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

const app = express();

app.use(cors());
app.use(express.json());
// app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({})
    .then((note) => res.json(note));
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => (note
      ? res.json(note)
      : res.status(400).end()))
    .catch((err) => next(err));
});

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    }).catch((err) => next(err));
});

// eslint-disable-next-line consistent-return
app.post('/api/notes', (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(404)
      .json({
        error: 'note.content is missing',
      });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: note.important || false,
  });

  newNote.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.use(notFound);
app.use(handleErrors);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
