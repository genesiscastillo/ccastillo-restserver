const express = require('express');
const Categoria = require('../models/categoria');
const { _ } = require('underscore');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();


app.delete('/categoria/:id', verificaToken ,(req , res )=>{
    let id = req.params.id;
    Categoria.findByIdAndDelete(id , (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificaToken , (req,res)=>   {
    let id = req.params.id;
    let body = _.pick(req.query , ['descripcion']);

    Categoria.findByIdAndUpdate( id , body , {new : true,runValidators:true}, (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

app.post('/categoria', verificaToken ,(req,res)=>   {
    console.log(req.query)
    let usuario = req.usuario;
    let categoria = new Categoria();
    categoria.descripcion = req.query.descripcion;
    categoria.usuario = usuario;

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            categoriaDB
        });
    } );
});

app.get('/categoria/:id', (req,res)=>   {
    console.log('id',req.params.id);
    let id = req.params.id;

    Categoria.findById( id , (err, categoria)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err:{
                    message:`No existe categoria con este id ${id}`
                }
            });
        }
        return res.json({
            id
        });
    })
});

app.get('/categoria', (req,res)=>   {

    Categoria.find({})
        .exec((err, categorias)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                categorias
            });
        });
});

module.exports = app;
