const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { uuid } = require('uuidv4');
const app = express();
// setup request logging
app.use(morgan('dev'));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Serve client from build folder
app.use(express.static(path.join(__dirname, '/public')));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: './.env'
});

const Gun = require('gun');
app.use(Gun.serve);
app.use(express.static(__dirname));
const port =
  process.env.NODEJS_PORT ||
  process.env.APP_PORT ||
  process.env.PORT ||
  process.argv[2] ||
  9417;

const server = app.listen(port, console.log(`Server started on port ${port}`));

const gun = new Gun({
  web: server,
  peers: [],
  mongo: process.env.MONGO_URL,
  verify: {
    check: (e) => {
      console.log(`PEER Connected`, e.origin);
      return true;
    }
  }
});

global.Gun = Gun;
global.gun = gun;

return console.log(`Server started on port ${port}`);
