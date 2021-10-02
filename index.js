const express = require('express');


const dotenv = require('dotenv');

const app = express();

dotenv.config({
  path: './.env'
});

const Gun = require('gun');
app.use(Gun.serve);
app.use(express.static(__dirname));
const port =  process.env.APP_PORT ||  9417;
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
