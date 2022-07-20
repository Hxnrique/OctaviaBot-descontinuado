
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10"

interface CommandData {
	name: string,
    data: RESTPostAPIChatInputApplicationCommandsJSONBody
}
import type { Octavia } from "../Client"
class Command {
    client: Octavia;
    name: string;
    data: RESTPostAPIChatInputApplicationCommandsJSONBody
    constructor(Client: Octavia, Data: CommandData){
        this.client = Client
        this.name = Data.name || ""
        this.data = Data.data
        }
	}
export { Command }
