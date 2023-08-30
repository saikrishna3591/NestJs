import {Entity,AfterInsert,AfterUpdate,AfterRemove,Column,PrimaryGeneratedColumn,OneToMany} from 'typeorm'
import { Report } from '../reports/report.entity';


// console.log(Report)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string

  @Column({default:true})
  admin:boolean

  @OneToMany(()=>Report,(report)=>report.user)
  reports: Report[]

  @AfterInsert()
  logInsert(){
    console.log('User inserted with id :',this.id)
  }

  @AfterUpdate()
  logUpdate(){
    console.log('Update user with id :',this.id)
  }

  @AfterRemove()
  logRemove(){
    console.log('Removed user with id :',this.id)
  }
}