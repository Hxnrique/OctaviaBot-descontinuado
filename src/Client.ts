
import Express, { Router, Response, Request } from "express"
import { readdir } from "node:fs/promises";
import { verifyKeyMiddleware } from "discord-interactions"
import { _client, Collections } from "./Functions/index";
import { REST } from "@discordjs/rest"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
class Octavia {
    app: any;
    router: any;
    config: any;
    handlers: {
        commands: any
    }
    cache: any;
    color: number;
    start: number;
    rest: any;
    options: any;
    prisma: any;
    constructor(){
        this.options = new _client(this)
        this.start = Date.now()
        this.handlers = {
            commands: []
        }
        this.rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN as string)
        this.cache = Collections
        this.app = Express()
        this.router = Router()
        this.color = this.options.color("#bf9ee9")
        this.prisma = prisma
    }
    uptime(): number {
        return Math.floor(Date.now() - this.start)
    }
    async run(){
        await prisma.$connect()
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
        this.router.post("/interaction", verifyKeyMiddleware(process.env.DISCORD_PUBLIC_TOKEN as string), (req: Request, res: Response) => {
            let interaction: any = req.body;
            switch(interaction.type){
                case 2: {
                    this.cache.users[interaction.member.user.id] = interaction.member.user
                    if(!this.cache.guilds[interaction.guild_id]){
                        this.cache.guilds[interaction.guild_id] = {
                            members: {
                                get: (userId: string) => {
                                    return this.cache.guilds[interaction.guild_id].members[userId]
                                },
                                fetchMember: this.options.getMembers
                            }
                        }
                    }
                    this.cache.guilds[interaction.guild_id].members[interaction.member.user.id] = interaction.member
                    let command = this.handlers.commands.find((x: any) => x.name == interaction.data.name)
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
                        return command.run({
                            interaction,
                            res,
                            req
                        })
                    }
                }
                case 5: {
                    interaction.getQuestion = (id: number, name: string, ) => {
                        return interaction.data.components[id].components.find((_name: any) => _name.custom_id == name).value
                    }
                    let command = this.handlers.commands.find((x: any) => x.name == interaction.data.custom_id.split(":")[0])
                    if(command){
                        command.runCollection({
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
                this.handlers.commands.push(_command)
            }
        }
    }
}
export { Octavia }