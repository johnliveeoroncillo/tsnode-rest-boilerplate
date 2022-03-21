import { writeFileSync, existsSync } from "fs";


const content = `@startuml

User ->  API: Enter username and Password

group Validation
    API -> Database: Check username and password

    alt Success
        Database -> API: Username and password is correct
        API -> User: Return access token
    end
    alt Error
        Database -> API: Username or password is incorrect
        API -> User: Return error message
    end
end

@enduml
`;

export class DocsTemplate {
    private readonly filename: string;
    private readonly name: string;
  
    constructor(name: string) {
      this.name = name.trim();
      this.filename = `${this.name}.puml`;
    }
  
    generate(): void {
        if (existsSync(`./docs/${this.filename}`))
            throw new Error("PUML file already existed");
        writeFileSync(
            `./docs/${this.filename}`,
            content,
        );
    }
  }