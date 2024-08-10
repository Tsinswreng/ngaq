import 'reflect-metadata';

const metadataKey = 'MyDecorator';

function MyDecorator(target, propertyKey) {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}

function myDecoratorUsingClass<T>(type:  Type<T>, propertyKey: string) {
    return myDecoratorUsingInstance(new type(), propertyKey);
}

function myDecoratorUsingInstance<T>(instance: T, propertyKey: string) {
  return !!Reflect.getMetadata(metadataKey, instance, propertyKey);
}

class MyClass {
   @MyDecorator
   property1;
   property2;
}

console.log(myDecoratorUsingClass(MyClass, 'property1')); // true
console.log(myDecoratorUsingClass(MyClass, 'property2')); // false

const instance = new MyClass();
console.log(myDecoratorUsingInstance(instance, 'property1')); // true
console.log(myDecoratorUsingInstance(instance, 'property2')); // false