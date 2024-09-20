import {AuthCtrler} from './auth-ctrler'
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AuthCtrler],
  providers: [],
})
export class AuthModule {
	constructor(){
	}
}
