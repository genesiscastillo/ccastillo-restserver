

process.env.PORT = process.env.PORT || 3000;
//============
// ENTORONO
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// VENCIMIENTO de Token
//===================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================
// SEED de autenticacion
//=======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// BASE DE DATOS

let urlDB;
if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.URLMONGDBO_CAFE;
}

process.env.URLDB = urlDB;

//===================
// Cliente IDE GOOGLE
//===================
// seteado a heroku config
process.env.CLIENT_ID = process.env.CLIENT_ID || '689631086934-u4lbjpfi5b8kadidd376nd746rghujl3.apps.googleusercontent.com';
