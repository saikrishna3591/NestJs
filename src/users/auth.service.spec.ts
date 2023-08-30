import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException, Catch, NotFoundException } from '@nestjs/common';

describe('AuthService',()=>{
  let service: AuthService
  let fakeUserService : Partial<UsersService>

  beforeEach(async () => {
      //create a fake copy of the user service
      const users: User[]=[]
      fakeUserService = {
        find:(email:string)=>{
          const filterdUsers = users.filter(user =>user.email === email)
          return Promise.resolve(filterdUsers)
        },
        create:(email:string,password:string)=> { 
          const user ={ id: Math.floor(Math.random() * 9999),
            email,
            password } as User
          users.push(user)
          return Promise.resolve(user)
        }
      }
      const module = await Test.createTestingModule({
        providers:[
          AuthService,
          {
            provide:UsersService,
            useValue:fakeUserService
          },
        ]
      }).compile()
      //it creates an instance of auth service
      service = module.get(AuthService)
    })

    it('can create a instance of auth service',async () => {
      // it is used to define 
      expect(service).toBeDefined()
    })

    it('it creates a new user with a salted and hashed password',async () => {
      const user = await service.signup('saik@test.com','12345')
      expect(user.password).not.toEqual('12345')
      const [salt,hash] = user.password.split('.')
      expect(salt).toBeDefined()
      expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use', async () => {
      fakeUserService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
      await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws if signin is called with an unused email', async () => {
      await expect(
        service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
      ).rejects.toThrow(NotFoundException);
    });
    
    it('throws if an invalid password is provided', async () => {
      fakeUserService.find = () =>
        Promise.resolve([
          { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
        ]);
      await expect(
        service.signin('laskdjf@alskdfj.com', 'passowrd'),
      ).rejects.toThrow(BadRequestException);
    });

    it('it returns a user if correct password is provided',async () => {
      await service.signup('laskdjf@alskdfj.com', 'passowrd')
      const user = await service.signin('laskdjf@alskdfj.com', 'passowrd')
      expect(user).toBeDefined()
    })
})