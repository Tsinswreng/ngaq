import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor(){
		console.log(arguments, 'app service')
	}
  getHello(): string {
    return 'Hello World!';
  }
}
