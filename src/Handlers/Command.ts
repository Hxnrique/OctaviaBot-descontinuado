
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10"

interface CommandData {
	name: string,
    data: RESTPostAPIChatInputApplicationCommandsJSONBody,
    database: boolean
}
import type { Octavia } from "../Client"
class Command {
    client: Octavia;
    name: string;
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    database: boolean
    constructor(Client: Octavia, Data: CommandData){
        this.database = Data.database
        this.client = Client
        this.name = Data.name || ""
        this.data = Data.data
        }
	}
export { Command }
