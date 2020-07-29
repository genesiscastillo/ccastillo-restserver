const jwt = require('jsonwebtoken');
//======================
// VERIFICAR TOKEN
//======================

let verificaToken = ( req, res , next )=>{

    let token = req.get('token');

    jwt.verify( token , process.env.SEED , (err , decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};
let verificaAutorizacionAdmin = ( req, res , next )=>{

    let usuario = req.usuario;
    if('ADMIN_ROLE' !== usuario.role) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no autorizado'
            }
        });
    }
    next();

};


module.exports = {
    verificaToken,
    verificaAutorizacionAdmin
};
