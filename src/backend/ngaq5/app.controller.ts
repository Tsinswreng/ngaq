import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Query } from '@nestjs/common';
@Controller('/app')
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
		@Req() req: Request,
	): string {
		const z = this
		console.log(query, 'query')
		console.log(req, 'req')
		return ''
	}
}
