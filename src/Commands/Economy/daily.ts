import { InteractionResponseFlags } from "discord-interactions";
import { Octavia } from "../../Client";
import { Command } from "../../Handlers/Command";

export default class DailyCommand extends Command {
    constructor(Client: Octavia){
        super(Client, {
            name: "daily",
            database: true,
            data: {
                name: "daily",
                type: 1,
                description: "[💰 Economy ] Pegue o seu auxílio do servidor.",
            }
        })
    }
    async run(params: any): Promise<void> {
        if((Date.now() - (new Date(params.database.guildMember.timers_daily).getTime()) - (86400000)) < 0){
            let time = Math.floor((new Date(params.database.guildMember.timers_daily).getTime() / 1000) + 85400)
            return params.res.send({
                type: 4,
                data: {
                    content: `❌ | <@!${params.interaction.member.user.id}>, você ja pegou seu daily! Volte aqui <t:${time}:R>, estou esperando você.`,
                    flags: 64
                }
            })
        }   
        if(params.database.guild.auxilio < 200){
            return params.res.send({
                type: 4,
                data: {
                    content: `❌ | <@!${params.interaction.member.user.id}>, o servidor não possuí o minímo de coins em seu auxílio que é de 🪙 **200** coins. Então não consigo entregar seu diário.`,
                    flags: 64
                }
            })
        }
        let ganhos =  Math.floor(Math.random() * (500 - 70) ) + 100;
        if(params.database.guild.auxilio < ganhos){
            return params.res.send({
                type: 4,
                data: {
                    content: `❌ | <@!${params.interaction.member.user.id}>, o servidor não possuí 🪙 **${ganhos}** coins em seu auxílio. Recomendo você a procurar um emprego.`,
                    flags: 64
                }
            })
        }
        await this.client.prisma.guild.update({
            where: {
                guild_id: params.interaction.guild_id
            },
            data: {
                auxilio: {
                    decrement: ganhos
                }
            }
        })
        await this.client.prisma.guildMember.update({
            where: {
                id: params.database.guildMember.id
            },
            data: {
                coins: {
                    increment: ganhos
                },
                timers_daily: new Date()
            }
        })
        return params.res.send({
            type: 4,
            data: {
                content: `✅ | <@!${params.interaction.member.user.id}> pegou seu daily, o valor ganho foi de 🪙 **${ganhos.toLocaleString('pt-br', {minimumFractionDigits: 0})}** coins, o servidor agora tem um valor de 🪙 **${Math.floor(params.database.guild.auxilio - ganhos).toLocaleString('pt-br', {minimumFractionDigits: 0})}** coins em seu auxílio.`
            }
        })
    }
}