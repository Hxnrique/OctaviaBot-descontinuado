
import Express, { Router, Response, Request } from "express"
import { readdir } from "node:fs/promises";
import { verifyKeyMiddleware } from "discord-interactions"
import { _client, Collections } from "./Functions/index";
import { REST } from "@discordjs/rest"
import { PrismaClient } from "@prisma/client";
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
    prisma: PrismaClient;
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
        this.prisma = new PrismaClient()
    }
    uptime(): number {
        return Math.floor(Date.now() - this.start)
    }
    async run(){
        await this.prisma.$connect()
        await this.app.use(this.router)
        await this.loadCommands()
        await this.loadRouters()
        await this.app.listen(process.env.PORT || 8080)
        this.start = Date.now()
        this.cache.client = {
            user: await this.options.getUser(),
            db: await this.prisma.octavia.findUnique({
                where: {
                    name: "octavia"
                }
            })
        }
    }
    async loadRouters(): Promise<void> {
        this.router.get("/", (req: Request, res: Response) => {
            return res.sendStatus(200)
        })
        this.router.post("/interaction", verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY as string), async (req: Request, res: Response) => {
            let interaction: any = req.body;
            switch(interaction.type){
                case 2: {
                    this.cache.users[interaction.member.user.id] = interaction.member.user
                    if(!this.cache.guilds[interaction.guild_id]){
                        this.cache.guilds[interaction.guild_id] = {
                        }
                        await this.options.getGuild(interaction.guild_id)
                    }
                    let command = this.handlers.commands.find((x: any) => x.name == interaction.data.name)
                    if(!command) return res.send({
                        type: 4,
                        data: {
                            content: `❌ | ${interaction.member.user.username}, eu não encontrei esse comando em meu sistema. Se não for pedir mutio, avise a meus developers.`,
                            flags: 64
                        }
                    })
                    interaction.getString = (name: string) => {
                        return interaction.data.options.find((_name: any) => _name.name == name)
                    }
                    let user, guild, guildMember;
                    if(command.database){
                        user = await this.prisma.user.findUnique({
                            where: {
                                user_id: interaction.member.user.id,
                            },
                            include: {
                                guilds: true
                            }
                        })
                        if(!user) user = await this.prisma.user.create({
                            data: {
                                user_id: interaction.member.user.id,
                                last_command: new Date(),
                            },
                            include: {
                                guilds: true
                            }
                        })
                        if(!user.guilds.find((guild) => guild.guild_id == interaction.guild_id )){
                            guildMember = await this.prisma.guildMember.create({
                                data: {
                                    guild_id: interaction.guild_id,
                                    user_id: {
                                        connect: { user_id: interaction.member.user.id}
                                    }
                                }
                            })
                            user.guilds.push(guildMember)
                        } else {
                            guildMember = user.guilds.find((guild: any) => guild.guild_id == interaction.guild_id)
                        }
                        if(user.blacklist){
                            return res.send({
                                type: 4,
                                data: {
                                    content: `❌ | <!@${interaction.member.user.id}>, você está proibido de utilizar meus comandos`,
                                    flags: 64
                                }
                            })
                        }
                        guild = await this.prisma.guild.findUnique({
                            where: {
                                guild_id: interaction.guild_id
                            }
                        })
                        if(!guild) guild = await this.prisma.guild.create({
                            data: {
                                guild_id: interaction.guild_id
                            }
                        })
                        if(guild.blacklist){
                            return res.send({
                                type: 4,
                                data: {
                                    content: `❌ | <!@${interaction.member.user.id}>, O servidor está em minha blacklist`,
                                    flags: 64
                                }
                            })
                        }
                    }
                    if(command){
                        return command.run({
                            database: {user, guild, guildMember},
                            interaction,
                            res,
                            req
                        })
                    }
                }
                case 3: {
                    let command = this.handlers.commands.find((x: any) => x.name == interaction.data.custom_id.split(":")[0])
                    if(command){
                        return command.runCollection({
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
                        return command.runCollection({
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