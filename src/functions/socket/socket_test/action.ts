import { Connection } from 'typeorm';
import axios from 'axios';
export class EventTestAction {
    private connection: Connection;
    
    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(payload: unknown): Promise<void> {
       
    }
}
