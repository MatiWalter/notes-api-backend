const mongoose = require('mongoose');
const { server } = require('../index');
const Note = require('../models/Note');
const { api, initialNotes, getAllContentFromNotes } = require('./helpers');

beforeEach(async () => {
  await Note.deleteMany({});

  // Paralelo
  const notesObjects = initialNotes.map((note) => new Note(note));
  const promises = notesObjects.map((note) => note.save());
  await Promise.all(promises);
});

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two notes', async () => {
    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(initialNotes.length);
  });

  test('is test note 1', async () => {
    const {
      contents,
    } = await getAllContentFromNotes();

    expect(contents).toContain('Nota testeo 1');
  });
});

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { contents, res } = await getAllContentFromNotes();

    expect(res.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
  });

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(404);

    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(initialNotes.length);
  });
});

test('a note can be deleted', async () => {
  const { res: firstRes } = await getAllContentFromNotes();
  const { body: notes } = firstRes;
  const noteToDelete = notes[0];

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const { contents, res: secondRes } = await getAllContentFromNotes();
  expect(secondRes.body).toHaveLength(initialNotes.length - 1);
  expect(contents).not.toContain(noteToDelete.content);
});

test('a note that has an invalid id can not be deleted', async () => {
  await api
    .delete('/api/notes/60ac259da8d8b745940495d1')
    .expect(404);

  const { res } = await getAllContentFromNotes();
  expect(res.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
