//import Tempus from "@shared/Tempus";
//import { $a } from "@shared/Ut";
import { $ } from "@shared/Common";

//console.log(Tempus.new())
//console.log($a)
//console.log($)

const code = 
`__return._='ok'`
const __return = {_:void 0}
const fn = new Function('__return', code)
const ans = fn(__return)
console.log(__return)
console.log($)