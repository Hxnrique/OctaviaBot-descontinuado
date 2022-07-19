
import Express, { Router, Response, Request } from "express"
import { readdir } from "node:fs/promises";
import config from "./../config"
import { verifyKeyMiddleware } from "discord-interactions"
import { Client, Collections } from "./Functions/index"
import { APIUser } from "discord-api-types/v10";
class Octavia {
    app: any;
    router: any;
    config: any;
    handlers: {
        commands: any
    }
    cache: any
    color: number
    start: number
    constructor(){
        this.start = Date.now()
        this.handlers = {
            commands: new Map()
        }
        this.cache = Collections
        this.app = Express()
        this.router = Router()
        this.config = config
        this.color = Client.color("#bf9ee9")
    }
    uptime(): number {
        return Math.floor(Date.now() - this.start)
    }
    async run(){
        await this.app.use(this.router)
        await this.loadCommands()
        await this.loadRouters()
        await this.app.listen(process.env.PORT || 8080)
        this.start = Date.now()
    }
    async loadRouters(): Promise<void> {
        this.router.get("/", (req: Request, res: Response) => {
            return res.sendStatus(200)
        })
        this.router.post("/interaction", verifyKeyMiddleware(this.config.discordPUBLICKey), (req: Request, res: Response) => {
            let interaction: any = req.body;
            switch(interaction.type){
                case 2: {
                    this.cache.users.set(interaction.member.user.id, interaction.member.user)
                    let command = this.handlers.commands.get(interaction.data.name)
                    if(!command) return res.send({
                        type: 4,
                        data: {
                            content: `${interaction.member.user.username}, eu não encontrei esse comando em meu sistema. Se não for pedir mutio, avise a meus developers.`,
                            flags: 64
                        }
                    })
                    interaction.getString = (name: string) => {
                        return interaction.data.options.find((_name: any) => _name.name == name)
                    }
                    if(command){
                        return this.handlers.commands.get(interaction.data.name).run({
                            interaction,
                            res,
                            req
                        })
                    }
                }
            }
        })
    }
    async loadCommands(): Promise<void> {
        let commandsFile = await readdir("./Commands/")
        for(let c of commandsFile){
            let _c = await readdir(`./Commands/${c}/`)
            for(let cmd of _c){
                let command = (await import(`./Commands/${c}/${cmd}`)).default
                let _command = new command(this)
                this.handlers.commands.set(_command.name, _command)
            }
        }
    }
}
export { Octavia }