const http = require('http');
const Gun = require('gun');

const server = http.createServer();
server.listen(9000, () => console.log(`Server started on port 9000`));

const gun = new Gun({
  web: server,
  peers: [],
  mongo: {
    database: 'gun_waelio',
    collection: 'cloud_server'
  },
  verify: {
    check: (e) => {
      console.log(`PEER Connected ${e}`);
      return true;
    }
  }
});
