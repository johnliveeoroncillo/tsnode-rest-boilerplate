import { Entity, Column } from "typeorm";
import { Model } from "../core/libs/Model";
@Entity({
  name: "users",
})
export class UsersModel extends Model {
    
  @Column({
    type: "varchar",
    length: 100
  })
  username: string;
                

  @Column({
    type: "varchar",
    length: 250
  })
  password: string;
                

  @Column({
    type: "varchar",
    length: 8
  })
  scope: string;
                
}