const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken , verificaAutorizacionAdmin} = require('../middlewares/autenticacion');

const app = express();

//app.use( express.json());

app.get('/usuario', verificaToken , (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite =Number( req.query.limite || 5 );

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        Usuario.countDocuments({},(err, conteo)=> {
            res.json({
                ok: true,
                total: conteo,
                usuarios
            });
        });
    });
});

app.post('/usuario', [verificaToken, verificaAutorizacionAdmin ],(req, res) => {
    console.log('------------------------------------');
    console.log('query', JSON.stringify(req.query));
    console.log('body', JSON.stringify(req.body));
    console.log('headers', JSON.stringify(req.headers));
    let body = req.query;
    let usuario = new Usuario({
        nombre   : body.nombre ,
        correo   : body.correo ,
        password : bcrypt.hashSync( body.password , 10 ),
        role     : body.role
    });

    usuario.save((err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAutorizacionAdmin]  ,(req, res) => {
    let id = req.params.id;
    let body = _.pick(req.query , ['nombre' , 'correo', 'img', 'role' , 'estado']);

    Usuario.findByIdAndUpdate( id ,body ,{new : true,runValidators:true},(err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAutorizacionAdmin] ,(req, res) => {
    let id = req.params.id;
    console.log(`id a borrar =  ${id} `)
    Usuario.findOneAndDelete( id , (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if( usuarioBorrado === null ){
            return res.status(400).json({
                ok:false,
                err:'Usuario no enonctrado'
            });
        }
        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    })
});

module.exports = app;
