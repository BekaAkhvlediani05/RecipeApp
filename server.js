const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(auth);
server.use(router);
server.use(cors());

server.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});
