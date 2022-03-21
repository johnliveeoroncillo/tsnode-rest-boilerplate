import { Entity, Column } from "typeorm";
import { Model } from "../core/libs/Model";
@Entity({
  name: "event_logs",
})
export class EventlogsModel extends Model {
    
  @Column({
    type: "varchar",
    length: 255
  })
  message: string;
                
}