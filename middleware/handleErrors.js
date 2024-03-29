// eslint-disable-next-line no-unused-vars
module.exports = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    response.status(404).send({ error: 'id used is malformed' });
  } else {
    response.status(500).end();
  }
};
