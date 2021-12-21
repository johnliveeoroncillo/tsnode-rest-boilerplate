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
  public username: string;
                

  @Column({
    type: "varchar",
    length: 250
  })
  public password: string;
                
}