const Block = require('./block');
const SHA256 = require('crypto-js/sha256');

class Blockchain{
    constructor(){
        this.chain = []; // aca van a estar todos los bloques 
        this.height = -1; //la longitud de la blockchain , que como la creamos ahora le ponemos -1
        this.initializeChain();
    }
    async initializeChain(){
        if(this.height === -1){ //si la cadena es mayor a uno , es porque ya fue creada, sino 
          const block = new Block({ data: "Genesis Block" })   // creamos una nueva blockchain
           await this.addBlock(block) //recibe el bloque que fue creado
        }
    }

    addBlock(block) {
        let self = this;
        return new Promise(async (resolve, rejected) => {
            block.height = self.chain.length; //la altura del bloque va a ser la longitud del chain que hice mas arriba
            block.time = new Date().getTime().toString()//el tiempo de creacion 
        
        if(self.chain.length > 0) { // si ya hay bloques, es decir si ya no estamos en el bloque genesis
            block.previousBlockHash = self.chain[self.chain.length - 1].hash; // a este nuevo bloque que vamos a añadir, su hash anterior(del bloque anterior) va a ser el hash de su bloque anterior
        }

        let errors = await self.validateChain(); //valido bloque a bloque , 
        if(errors.length > 0){ //y si alguno de los bloques no es valido y falla
            rejected(new Error("The chain is not valid", errors)); //retorno este error
        } // sino hay fallas continuo y creo el hash
        block.hash = SHA256(JSON.stringify(block)).toString(); //num hexadecimal lo paso a string
        self.chain.push(block)  // lo añado a la cadena
        resolve(block);//resuelvo la promesa con el bloque añadido    
    })
    }

    validateChain(){
        let self = this;
        const errors = [];

        return new Promise(async(resolve, rejected) => {
            self.chain.map(async(block) => { // recorro el array de block
             try {
                 let isValid = await block.validate();
                 if(!isValid){
                     errors.push(new Error('The block ${block.height} is not valid'));
                 }
             } catch (error) {
                 errors.push(error)
             }   
        })
        resolve(errors)
    })
}


print(){
    let self = this;
    for(let block of self.chain){
        console.log(block.toString())
    }
}
}

module.exports = Blockchain;