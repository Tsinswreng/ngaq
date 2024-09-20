import { plainToInstance, Transform } from "class-transformer";
import type { PubConstructor, InstanceType_ } from "@shared/Type";

type Fn_plainToInst<P, C extends PubConstructor<P>> 
	= (plain:P, cls:C, opt?:any) => InstanceType_<C>;

export function plainToInst<
	P, C extends PubConstructor<P>
>(plain:P, cls:C, opt?:Parameters<Fn_plainToInst<P, C>>[2]){
	return plainToInstance(cls, plain, opt);
}

export function trans(...args:Parameters<typeof Transform>){
	return Transform(...args);
}