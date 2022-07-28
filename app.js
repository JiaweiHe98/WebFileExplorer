const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const viewRouter = require('./router/viewRouter');
const apiRouter = require('./router/apiRouter');

const app = express();

app.set('view engine', 'ejs');

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/view', viewRouter);
app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.redirect('/view');
});

module.exports = app;
