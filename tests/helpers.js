const supertest = require('supertest');
const { app } = require('../index');

const api = supertest(app);

const initialNotes = [
  {
    content: 'Nota testeo 1',
    date: new Date(),
    important: true,
  },
  {
    content: 'Nota testeo 2',
    date: new Date(),
    important: true,
  },
];

const getAllContentFromNotes = async () => {
  const res = await api.get('/api/notes');
  return {
    contents: res.body.map((note) => note.content),
    res,
  };
};

module.exports = {
  initialNotes,
  getAllContentFromNotes,
  api,
};
