const { request } = require('express');
const express = require('express');
const path = require('path');
const axios = require("axios");
const morgan = require('morgan');
const { ADDRGETNETWORKPARAMS } = require('dns');
const app = express();

app.set('json-spaces', 2);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.listen(3001, () =>{
    console.log("Escuchando en el puerto 3000");
});


//Rutas de vistas
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

//ruta de API
app.post('/api/pokemon/search/',(req,res) =>{

    let pokemonABuscar = req.body.pokemon.toLowerCase();
    axios.get('https://pokeapi.co/api/v2/pokemon/'+ pokemonABuscar).then((response) =>{
        let pokemon = response.data;
        let movimientos = [];
        let tipos = [];
        // pokemon.moves.forEach((move) => {
        //     movimientos.push(move.move.name);
        // });
        for(let i=0; i < (pokemon.moves.length > 5 ? 5:pokemon.moves.length); i++){
            movimientos.push(pokemon.moves[i].move.name);
        }
        pokemon.types.forEach((type) => {
            tipos.push(type.type.name);
        });
        //res.json(response.data);

        axios.get(pokemon.species.url).then((secResponse) => {
            desc = secResponse.data.flavor_text_entries;
            let descripcion = '';
            desc.forEach((ch) =>{
                if(ch.language.name == 'es' ){
                    descripcion += ch.flavor_text + " ";
                }
                
            });
            res.json({
                success:true,
                result:{
                    id: pokemon.id,
                    imagen: pokemon.sprites.other["official-artwork"].front_default,
                    nombre: pokemon.name,
                    altura: pokemon.height * 10,
                    peso:pokemon.weight / 10,
                    tipos:tipos,
                    ability: pokemon.abilities[0].ability.name,
                    movimientos: movimientos,
                    descripcion:descripcion
                }
            });
        }).catch(function(error){
            res.json({
                success:false,
                result: error
            })
        });
        
    }).catch(function (error) {
        res.json({
            success:false,
            result: error
        })
      });
    
});