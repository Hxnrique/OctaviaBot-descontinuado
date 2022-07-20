
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10"

interface CommandData {
	name: string,
	buttons?: Array<string>,
	modals?: Array<string>,
	menus?: Array<string>,
    data: RESTPostAPIChatInputApplicationCommandsJSONBody
}
import type { Octavia } from "../Client"
class Command {
    client: Octavia;
    name: string;
    buttons?: Array<string>;
    menus?: Array<string>;
	modals?: Array<string>;
    data: RESTPostAPIChatInputApplicationCommandsJSONBody
    constructor(Client: Octavia, Data: CommandData){
        this.client = Client
        this.name = Data.name || ""
        this.buttons = Data.buttons || []
        this.menus = Data.menus || []
		this.modals = Data.modals || []
        this.data = Data.data
        }
	}
export { Command }
