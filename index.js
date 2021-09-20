const port =
  process.env.NODEJS_PORT ||
  process.env.APP_PORT ||
  process.env.PORT ||
  process.argv[2] ||
  9000;

const express = require('express');
const app = express();
const Gun = require('gun');
app.use(Gun.serve);
app.use(express.static(__dirname));

const server = app.listen(port, console.log(`Server started on port 9000`));

const gun = new Gun({
  file: 'data.json',
  web: server,
  peers: [],
  mongo: {
    database: 'gun_waelio',
    collection: 'cloud_server'
  },
  verify: {
    check: (e) => {
      console.log(`PEER Connected`, e);
      return true;
    }
  }
});

global.Gun = Gun;
global.gun = gun;
