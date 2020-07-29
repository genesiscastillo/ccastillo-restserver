const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();


const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {

    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let newdate = year + "/" + month + "/" + day;
    console.log('---------------- ', Math.floor(Math.random() * (1000000 - 10)) + 10 );
    console.log('POST /login -> ', newdate);
    console.log(req.query);
    let body = req.query;

    Usuario.findOne({ correo : body.correo }, (err,usuarioDB)=>{
        if( err ){
            return  res.status(500).json({
                ok: false,
                err
            })
        }
        if( !usuarioDB ) {
            return  res.status(400).json({
                ok: false,
                err:{
                    message:'(Usuario) o contraseña incorrecta'
                }
            })
        }
        if( !bcrypt.compareSync(body.password , usuarioDB.password ) ){
            return  res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario o (contraseña) incorrecta'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok:true,
            usuario:usuarioDB,
            token: token
        });
    });
});

//===========================
// Configuracion de Google Api key
//===========
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre : payload.name,
        correo : payload.email,
        img : payload.picture,
        google: true
    }
}

app.post('/google', async (req,res)=>{

    console.log('idToken params  =',req.params);
    console.log('idToken body  =',req.body);
    console.log('idToken myToken  =',req.body.myToken);

    console.log('idToken query =',req.query);
    console.log('idToken get =',req.get('myToken'));
    let token = req.query.myToken;
    console.log('-----------------------------------------------');
    console.log('token ',token);
    console.log('-----------------------------------------------');
    let googleUser = await verify( token )
                            .catch(e =>{
                                return res.status(403)
                                    .json({
                                        ok:false,
                                        err:e
                                    });
                            });

    Usuario.findOne({ correo: googleUser.email}, ( err, usuarioDB ) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( usuarioDB ){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'Debe usar su autenticacion normal'
                    }
                });
            }
            else{
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN} );

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        }
        else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.correo = googleUser.email;
            usuario.img    = googleUser.picture;
            usuario.google = true
            usuario.password = ':)';

            usuario.save( ( err , usuarioDB ) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN} );

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});


module.exports = app;

