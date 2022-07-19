interface CommandData {
	name: string,
	buttons?: Array<string>,
	modals?: Array<string>,
	menus?: Array<string>
}

import type { Octavia } from "./../WebServer"
class Command {
    client: Octavia
    name: string;
    buttons?: Array<string>;
    menus?: Array<string>;
	modals?: Array<string>;
    constructor(Client: Octavia, Data: CommandData){
        this.client = Client
        this.name = Data.name || ""
        this.buttons = Data.buttons || []
        this.menus = Data.menus || []
		this.modals = Data.modals || []
        }
	}
export { Command }
