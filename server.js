const app = require('./app');

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Now listen on port: ${PORT}`);
  }
});
