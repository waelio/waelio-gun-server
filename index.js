const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config({
  path: './.env'
});

const White_List = [
  'http://localhost:9000/gun',
  'https://waelio.herokuapp.com:9000/gun',
  'https://gun.waelio.com:9000/gun'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (White_List.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors());

const Gun = require('gun');
app.use(Gun.serve);
const port =
  process.env.APP_PORT ||
  process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.VCAP_APP_PORT ||
  process.env.PORT ||
  process.argv[2] ||
  4500;

const server = app.listen(port, console.log(`Server started on port ${port}`));

const gun = new Gun({
  file: 'data.json',
  web: server,
  peers: [
    'http://localhost:9000/gun',
    'https://waelio.herokuapp.com:9000/gun',
    'https://gun.waelio.com:9000/gun'
  ],
  mongo: process.env.MONGO_URL,
  verify: {
    check: (e) => {
      console.log(`PEER Connected`, e.origin);
      return true;
    }
  }
});

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

console.log('Server started on port ' + port + ' with /gun');
