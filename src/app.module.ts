import { Module,ValidationPipe,MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { config } from 'process';
const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:`.env.${process.env.NODE_ENV}`
  }),
  // TypeOrmModule.forRoot(),
  TypeOrmModule.forRootAsync({
    inject : [ConfigService],
    useFactory: (config:ConfigService)=>{
      return {
        type:'sqlite',
        database:config.get<string>('DB_NAME'),
        synchronize:true,
        entities:[User,Report]
      }
    }
  }),
  UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:APP_PIPE,
      useValue:new ValidationPipe({
        whitelist:true
      })
    }
  ],
})
export class AppModule {
  constructor(private configService : ConfigService){

  }
  configure(consumer:MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys:[this.configService.get('COOKIE_KEY')]
      })
    ).forRoutes('*')
  }
}



//   TypeOrmModule.forRoot({
  //   type:'sqlite',
  //   database:'db.sqlite',
  //   entities:[User,Report],
  //   synchronize:true
  // }),