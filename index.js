const { request } = require('express');
const express = require('express');
const path = require('path');
const axios = require("axios");
const morgan = require('morgan');
const app = express();

app.set('json-spaces', 2);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.listen(3000, () =>{
    console.log("Escuchando en el puerto 3000");
});


//Rutas de vistas
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

//ruta de API
app.get('/api/pokemon/search/',(req,res) =>{

    axios.get('https://pokeapi.co/api/v2/pokemon/'+ req.body.pokemon).then((response) =>{
        res.json({
            success:true,
            result: response.data
        })
    }).catch(function (error) {
        res.json({
            success:false,
            result: "Ocurrió un error, vuelve a intentarlo más tarde"
        })
      });
    
});