require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use( express.json());

//Habilitar la carpeta public
app.use( express.static( path.resolve(__dirname ,'../public')));

app.use(require('./routes/index'));

console.log('CONECTADO A ',process.env.URLDB);

mongoose.connect( process.env.URLDB ,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) =>{
    if(err) throw err;

    console.log('Bse datos ONLINE');
});

app.listen( process.env.PORT,() => {
    console.log(`Escuchando ${ process.env.PORT } -v2.0  Servidor listo..!!!`);
});
