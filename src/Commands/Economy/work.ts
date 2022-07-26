import type { Octavia } from "../../Client";
import { Command } from "../../Handlers/Command";

export default class WorkCommand extends Command {
    constructor(Client: Octavia){
        super(Client, {
            name: "work",
            database: true,
            data: {
                name: "work",
                description: "[💰] Todos trabalhos disponíveis para você.",
                options: [{
                    type: 1,
                    name: "jobs",
                    description: "[💰 Economy ] Todos trabalhoes que você tem experiência.",
                },{
                    type: 1,
                    name: "experience",
                    description: "[💰 Economy ] Adquirir experiência em algum trabalho"
                }]
            }
        })
    }
    async run(params: any): Promise<void> {
        if(params.interaction.getString("jobs")){
            let empregos: Array<any> = []
            for(let level in Object.keys(this.client.cache.levelGuilds)){
                if(level < params.database.guild.level){
                    let _level = this.client.cache.levelGuilds[Number(level) + 1].works
                    let __level: any = Object.keys(_level)
                    empregos.push({
                        name: __level[0],
                        value: _level[__level[0]].value,
                        experience: _level[__level[0]].experience
                    },
                    {
                        name: __level[1],
                        value: _level[__level[1]].value,
                        experience: _level[__level[1]].experience
                    })
                }
            }
            return params.res.send({
                type: 4,
                data: {
                    embeds: [{
                        author: {  name: `${this.client.cache.client.user.username} | Work`,icon_url: this.client.options.getAvatarURL(this.client.cache.client.user)},
                        description: `Usuário: **${params.interaction.member.user.username}**\nO usuário possuí: 🪙 **${params.database.guildMember.coins.toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins`,
                        fields: [{
                            name: `🆙 | Empregos`,
                            value: `O servidor está no level: **${params.database.guild.level}**. Então caso haja apenas dois empregos é porque o servidor não está em um nível alto.\nO servidor possuí: **${empregos.length}** Empregos`
                        }],
                        thumbnail: { url: this.client.options.getAvatarURL(params.interaction.member.user)},
                        timestamp: new Date(),
                        footer: { icon_url: this.client.options.getAvatarURL(params.interaction.member.user), text: `Usado por: ${params.interaction.member.user.id}`},
                        color: this.client.color
                    }]
                }
            })
        }
    }
}