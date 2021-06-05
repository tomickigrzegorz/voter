const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./sources/images.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})