import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {$} from '@shared/Common'


export async function bootstrap() {
	console.log($)//t
	const app = await NestFactory.create(AppModule);
	await app.listen(3001);
}

//E:/_code/ngaq/src/backend/ngaq5/main.ts
//E:/_code/ngaq/out/backend/ngaq5/main.js

/* 
pnpm config set proxy http://your-proxy-url:port
pnpm config set https-proxy http://your-proxy-url:port

pnpm config set proxy http://127.0.0.1:7890
pnpm config set https-proxy http://127.0.0.1:7890
*/