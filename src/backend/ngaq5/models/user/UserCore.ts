import { mixinIdBlCtMtEntity } from "@shared/dbFrame/EntityFactory";
import { typeormDecorators as D } from "@shared/dbFrame/decorators/TypeormDecorators";


function mixin_UserCoreEntity(){

}

class UserCoreEntity extends mixinIdBlCtMtEntity(Object) {
	uniqueName: string;
}


// (a,b) => {
// 	return a + b
// }

// function add(a,b){
// 	return a + b
// }



// function Run(args){
// 	return new Promise((res, rej)=>{
// 		run(args, (err, result)=>{
// 			if(err){
// 				rej(err)
// 				return
// 			}
// 			res(result)
// 		})
// 	})
// }