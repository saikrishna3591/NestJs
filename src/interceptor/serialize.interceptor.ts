import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'

import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import { plainToClass } from 'class-transformer'
// import { UserDto } from 'src/users/dtos/user.dto'

export function Serialize(dto:any){
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto:any){}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    //run something before a request is handled by the request handler
    console.log('i am running before the handler',context)

    return next.handle().pipe(
      map((data:any)=>{
        // running something before the response is sent out
        return plainToClass(this.dto,data,{
          excludeExtraneousValues:true
        })
      })
    )
  }
}