

process.env.PORT = process.env.PORT || 3000;
//============
// ENTORONO
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE DATOS

let urlDB;
if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://genesiscastillo:tp2eN0Ps9WN9Gkpp@cluster0.gqevj.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
