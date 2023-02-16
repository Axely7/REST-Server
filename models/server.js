const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload')
const {createServer} = require('http')
const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.server = createServer(this.app)
    this.io = require('socket.io')(this.server)

    this.paths = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      buscar: '/api/buscar',
      uploads: '/api/uploads',
    }
    
    // Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares();
    // Rutas de mi aplicacion

    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB(){
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
      limits: {fileSize: 50 * 1024 * 1024} // 50MB limit
  }));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categorias, require("../routes/categorias"))
    this.app.use(this.paths.usuarios, require("../routes/user"))
    this.app.use(this.paths.productos, require("../routes/productos"))
    this.app.use(this.paths.buscar, require("../routes/buscar"))
    this.app.use(this.paths.uploads, require("../routes/uploads"))
  }

  sockets(){
    this.io.on('connection', (socket) => socketController(socket, this.io))
  }

  listen() {
    this.server.listen(this.port, () =>
      console.log("Servidor Corriendo en Puerto", this.port)
    );
  }
}

module.exports = Server;
