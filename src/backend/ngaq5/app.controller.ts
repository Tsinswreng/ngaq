import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import chalk from 'chalk';
import { Query } from '@nestjs/common';
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
		console.log(arguments, 'app.controller')// {}
	}

	@Get()
	getHello(): string {
		const z = this
		console.log(z.appService)
		return '114514'
	}

	@Get('/h')
	getHello2(
		@Query() query: any,
	): string {
		const z = this
		console.log(z.appService)
		console.log(query, 'query')
		return ''
	}
}
