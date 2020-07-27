require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const server = express();

server.use( express.json());

server.use(require('./routes/usuario'));

console.log('CONECTADO A ',process.env.URLDB);

mongoose.connect( process.env.URLDB ,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) =>{
    if(err) throw err;

    console.log('Bse datos ONLINE');
});

server.listen( process.env.PORT,() => {
    console.log(`Escuchando ${ process.env.PORT } -v2.0  Servidor listo..!!!`);
});
