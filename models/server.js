const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      buscar: '/api/buscar'
    }
    
    // Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares();
    // Rutas de mi aplicacion

    this.routes();
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
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categorias, require("../routes/categorias"))
    this.app.use(this.paths.usuarios, require("../routes/user"))
    this.app.use(this.paths.productos, require("../routes/productos"))
    this.app.use(this.paths.buscar, require("../routes/buscar"))
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log("Servidor Corriendo en Puerto", this.port)
    );
  }
}

module.exports = Server;
