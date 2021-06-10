require('dotenv').config();
require('./mongo');
const express = require('express');

const app = express();
const cors = require('cors');
const Note = require('./models/Note');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

app.use(cors());
app.use(express.json());
// app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
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

app.delete('/api/notes/:id', async (req, res) => {
  const response = await Note.findByIdAndRemove(req.params.id);
  if (response === null) {
    res.sendStatus(404);
  } else {
    res.status(204).end();
  }
});

app.post('/api/notes', async (req, res, next) => {
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

  // newNote.save().then((savedNote) => {
  //   res.json(savedNote);
  // }).catch((err) => next(err));
  let savedNote;
  try {
    savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    next(err);
  }
  return savedNote;
});

app.use(notFound);
app.use(handleErrors);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {
  app,
  server,
};
