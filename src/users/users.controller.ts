import {Body, Controller, Post,Query,Patch,Get,Param ,Delete,NotFoundException,UseInterceptors,ClassSerializerInterceptor,Session,UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private userService:UsersService,private authService:AuthService){}

  // @Get('/colors/:color')
  // setColor(@Param('color') color:string, @Session() session:any){
  //   session.color = color
  // }

  // @Get('/colors')
  // getColor(@Session() session:any){
  //   return session.color
  // }
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto,@Session() session:any){
    // this.userService.create(body.email,body.password)
    const user = await this.authService.signup(body.email,body.password)
    session.userId = user.id
    return user
  }
  @Post('/signin')
  async signin(@Body() body:CreateUserDto,@Session() session:any){
    const user = await this.authService.signin(body.email,body.password)
    session.userId = user.id
    return user
  }

  // @Get('/whoami')
  // whoami(@Session() session:any){
  //   return this.userService.findOne(session.userId)
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user:User){
    return user
  }

  @Post('/signout')
  signOut(@Session() session:any){
    session.userId = null
  }
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id:string){
    console.log('handler is running')
    const user = await this.userService.findOne(parseInt(id))
    if(!user){
      throw new NotFoundException('User not found')
    }
    return user
  }
  @Get()
  findAllUsers(@Query('email') email:string){
    return this.userService.find(email)
  }
  @Delete('/:id')
  removeUser(@Param('id') id:string){
    return this.userService.remove(parseInt(id))
  }
  @Patch('/:id')
  updateUser(@Param('id') id:string,@Body() body:UpdateUserDto){
    return this.userService.update(parseInt(id),body)
  }
}
