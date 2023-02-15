
const url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth/'
: 'url del servidor donde será desplegado' 

let usuario = null;
let socket = null;


// Referencias html
const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')




const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){
        window.location = 'index.html'
        throw new Error('No hay token en el servidro')
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {usuario: userDB, token: tokenDB} = await resp.json()
    localStorage.setItem('token', tokenDB);
    usuario = userDB

    document.title = usuario.nombre;

    await conectarSocket()
    
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes', () => {

    })

    socket.on('usuarios-activos', () => {
        
    })

    socket.on('mensaje-privado', () => {
        
    })
}


const main = async() => {

    await validarJWT()


}

main()
// const socket = io();


