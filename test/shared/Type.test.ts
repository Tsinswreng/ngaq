class Person{
	protected _name
	get name(){return this._name}
	set name(v){this._name = v}

	protected _age
	get age(){return this._age}
	set age(v){this._age = v}

	protected _sex
	get sex(){return this._sex}


	fnvoid(){}

	fn1arg(v){}

}
// typescript 如何獲取一個類的所有set修改器的類型?
// 比如 Setter<Person> 返回 'name'|'age'

type SetterKeys<T> = {
	[K in keyof T]: T[K] extends { set(value: infer V): void } ? K : never
  }[keyof T];
  
  // 提取 Person 类的所有 set 修改器的键
  type PersonSetterKeys = SetterKeys<Person>;
  // PersonSetterKeys 将是 'name' | 'age'

// type SetterKeys<T> = {
// 	[K in keyof T]: ((
// 	  T[K] extends (...args: any[]) => any ? never : K
// 	) extends infer D
// 	  ? D extends keyof T
// 		? (T[D] extends {
// 			set(value: any): void;
// 		  }
// 			? K
// 			: never)
// 		: never
// 	  : never);
//   }[keyof T];
  
//   // 提取 Person 类的所有 set 修改器的键
//   type PersonSetterKeys = SetterKeys<Person>;
  
//   // 验证
//   let test: PersonSetterKeys;

//   test = 'name'; // OK
//   test = 'age';  // OK
//   test = 'sex';  // Error: Type '"sex"' is not assignable to type 'never'.