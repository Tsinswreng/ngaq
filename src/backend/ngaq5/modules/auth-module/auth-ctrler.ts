import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller()
export class AuthCtrler {
	constructor() {
	}

	@Get()
	getHello(): string {
		const z = this
		return '114514'
	}

	@Get('/h')
	getHello2(
		@Query() query: any,
	): string {
		const z = this
		console.log(query, 'query')
		return '123'
	}
}

