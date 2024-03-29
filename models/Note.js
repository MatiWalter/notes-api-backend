/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { model, Schema } = require('mongoose');

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = model('Note', noteSchema);

module.exports = Note;
