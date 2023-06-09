import VocaRaw from "./VocaRaw";
const fs = require('fs')

console.log(__dirname)
const voca:VocaRaw[] = VocaRaw.getObjsByConfig()
//voca[1].init()
console.log(voca[1].srcFilePath)

//let out:string = fs.readFileSync('\\'+voca[1].srcFilePath)
