
const hex2ascii = require('hex2ascii');
const SHA256 = require('crypto-js/sha256');

class Block {
constructor(data){
    this.hash = null;
    this.height= 0;
    this.body = Buffer.from(JSON.stringify(data).toString('hex')); // paso los datos que me llegan como string a hexadecimal
    this.time = 0;
    this.previousBlockHash = '';
    }

    validate(){
        const self = this; // con el this, hacemos referencia al Block.
        return new Promise((resolve, reject) => {
            let currentHash = self.hash; // el hash actual lo tenemos en self.hash
    
            self.hash = SHA256(JSON.stringify({ // para calcular el hash utilizo el sha256 y le paso los datos 
                ...self, hash: null 
            })).toString();

            if(currentHash !== self.hash) { //si el hash actual es distinto del hash que acabo de generar
                return resolve(false);
            } 
            resolve(true)
        })
    }

    getBlockData(){
        const self = this;
        return new Promise((resolve, reject) => {
            let encodeData = self.body // aca tendriamos todo el codigo hexadecimal
            let decodeData = hex2ascii(encodeData) // lo pasamos a codigo texto -- un string re largo con un objeto adentro
            let dataObject = JSON.parse(decodeData) // y ese objeto lo convertimos a objeto propio de javascript, y con este obj podemos manipularlo
    
            if(dataObject === 'Genesis Block'){ //pongo de ej el primer bloque creado que fue el genesis, que no tenia hash previo y contaba con una altura de 0
                return (new Error("This is the Genesis Block"));
            }
            resolve(dataObject);
        });
    }

    toString(){
        const {hash, height, body, time, previousBlockHash} = this;
        return `Block -
        hash: ${hash}
        height: ${height}
        body: ${body}
        time: ${time}
        previousBlockHash: ${previousBlockHash}
        --------------------------------------`;

    }
}

module.exports = Block;