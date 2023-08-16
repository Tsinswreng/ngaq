require('tsconfig-paths/register');
import Txt from "Txt";
import Ut from "Ut";


let l1 = ['a', 'b', 'c']
let l2 = ['b', 'c', 'a', 'a']
let l3 = ['b', 'c', [1,2,3],'a', 'a']
let f = ['OC_schuesslerOC.dict.yaml']
let r = Txt.getFilted(f,'^.*\\.dict\\.ya?ml$')
//console.log(r)
//console.log('r: '+r)


