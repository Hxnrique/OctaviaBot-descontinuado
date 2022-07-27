import { APIActionRowComponent, APIModalActionRowComponent, APIModalComponent, GuildScheduledEventEntityType } from "discord-api-types/v10";
import type { Octavia } from "../../Client";
import { Command } from "../../Handlers/Command";
export default class ConfigCommand extends Command {
    constructor(Client: Octavia){
        super(Client, {
            name: "config",
            database: true,
            data: {
                name: "config",
                default_member_permissions: "8",
                description: "[🔧] Configure os sistemas da Octavia.",
                options: [{
                    type: 1,
                    name: "economy",
                    description: "[🔧 Config ] Configure os sistemas de economia local/global."
                }]
            }
        })
    }
    async run(params: any): Promise<void> {
        let guild = this.client.cache.guilds.get(params.interaction.guild_id)._guild
        let embed_1 = async () => {
            let _guild = await this.client.prisma.guild.findUnique({
                where: {
                    guild_id: params.interaction.guild_id
                }
            })
            if(!_guild) _guild = await this.client.prisma.guild.create({
                data: {
                    guild_id: params.interaction.guild_id
                }
            })
            return {
                description: `Servidor: **${guild.name}**\nO servidor possuí: 🪙 **${Math.floor(_guild.money).toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins`,
                fields: [
                    {
                        name: "🗺️ | Status", 
                        value: `Auxílio: 🪙 **${_guild.auxilio.toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins\nImposto que o servidor cobra: **${_guild.imposto}%** do valor ganho\nLevel do servidor **${_guild.level}/${this.client.cache.client.db.levelMax}** `
                    },
                ],
                author: {icon_url: this.client.options.getAvatarURL(this.client.cache.client.user), name: `${this.client.cache.client.user.username} | Economy`},
                thumbnail: {url: this.client.options.getIconURL(guild)},
                color: this.client.color,
                timestamp: new Date(),
                footer: { text: `Usado por: ${params.interaction.member.user.id}`,icon_url: this.client.options.getAvatarURL(params.interaction.member.user)}
            }
        }
        if(params.interaction.getString("economy")){
            params.res.send({
                type: 4,
                data: {
                    embeds: [await embed_1()],
                    components: [{
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                label: "Definir auxílio",
                                custom_id: "config:auxilio"
                            },
                            {
                                type: 2,
                                style: 1,
                                custom_id: "config:imposto",
                                label: "Definir imposto"
                            },
                            {
                                type: 2,
                                style: 1,
                                custom_id: "config:level_update",
                                label: "Upar de nível"
                            }
                        ]
                    }]
                }
            })
            this.client.cache.messageComponents.set(params.interaction.id,{
                interaction: {
                    id: params.interaction.id,
                    token: params.interaction.token,
                    application_id: params.interaction.application_id
                },
                users: [ params.interaction.member.user.id ]
            })
        }
    }
    async runCollection(params: any): Promise<void> {
    // past past past past
        let guild = this.client.cache.guilds.get(params.interaction.guild_id)._guild
        let embed_1 = async () => {
            let _guild = await this.client.prisma.guild.findUnique({
                where: {
                    guild_id: params.interaction.guild_id
                }
            })
            if(!_guild) _guild = await this.client.prisma.guild.create({
                data: {
                    guild_id: params.interaction.guild_id
                }
            })
            return {
                description: `Servidor: **${guild.name}**\nO servidor possuí: 🪙 **${Math.floor(_guild.money).toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins`,
                fields: [
                    {
                        name: "🗺️ | Status", 
                        value: `Auxílio: 🪙 **${_guild.auxilio.toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins\nImposto que o servidor cobra: **${_guild.imposto}%** do valor ganho\nLevel do servidor **${_guild.level}/${this.client.cache.client.db.levelMax}** `
                    },
                ],
                author: {icon_url: this.client.options.getAvatarURL(this.client.cache.client.user), name: `${this.client.cache.client.user.username} | Economy`},
                thumbnail: {url: this.client.options.getIconURL(guild)},
                color: this.client.color,
                timestamp: new Date(),
                footer: { text: `Usado por: ${params.interaction.member.user.id}`,icon_url: this.client.options.getAvatarURL(params.interaction.member.user)}
            }
        }
        // past past past past 
        let cacheMessage = this.client.cache.messageComponents.get(params.interaction.message.interaction.id)
        if(!cacheMessage)return params.res.send({
            type: 4,
            data: {
                content: `❌ | <@!${params.interaction.member.user.id}>, essa interação foi descartada, utilize o comando novamente.`,
                flags: 64
            }
        })
        if(!params.interaction.member.user.id.includes(cacheMessage.data.users))return params.res.send({
            type: 4,
            data: {   
                content: `❌ | <@!${params.interaction.member.user.id}>, esse painel de configurações não é para você.`,
                flags: 64
            }
        })
        let _guild = await this.client.prisma.guild.findUnique({
            where: {
                guild_id: params.interaction.guild_id
            }
        })
        if(!_guild) _guild = await this.client.prisma.guild.create({
            data: {
                guild_id: params.interaction.guild_id
            }
        })
        switch(params.interaction.data.custom_id){
            case "config:auxilio": {
                return params.res.send({
                    type: 9,
                    data: {
                        title: `Config | Auxílio`,
                        custom_id: "config:auxilio:questions",
                        components: [{
                            type: 1,
                            components: [{
                                custom_id: "config:auxilio:q1",
                                type: 4,
                                style: 1,
                                min_length: 2,
                                max_length: 7,
                                placeholder: "Digite o valor",
                                label: "Coins",
                                requered: true
                            }]
                        }]
                    }
                })
            }
            case "config:imposto": {
                return params.res.send({
                    type: 9,
                    data: {
                        title: `Config | Imposto`,
                        custom_id: "config:imposto:questions",
                        components: [{
                            type: 1,
                            components: [{
                                custom_id: "config:imposto:q1",
                                type: 4,
                                style: 1,
                                min_length: 1,
                                max_length: 7,
                                placeholder: "Digite a porcentagem de 0 a 20",
                                label: "Porcentagem",
                                requered: true
                            }]
                        }]
                    }
                })
            }
            case "config:auxilio:questions": {
                let auxilio_coins = Number(params.interaction.getQuestion(0, "config:auxilio:q1"))
                if(isNaN(auxilio_coins)){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, o valor tem que ser um número valido`,
                            flags: 64
                        }
                    })
                } else if(auxilio_coins < 10){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, o valor mínimo é de 🪙 **10** coins`,
                            flags: 64
                        }
                    })
                } else if(_guild.money < auxilio_coins){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, o servidor não possui essa quantidade de coins`,
                            flags: 64
                        }
                    })
                }
                await this.client.prisma.guild.update({
                    where: {
                        guild_id: params.interaction.guild_id
                    },
                    data: {
                        money: {
                            decrement: Math.floor(auxilio_coins)
                        },
                        auxilio: {
                            increment: Math.floor(auxilio_coins)
                        }
                    }
                })
                return params.res.send({
                    type: 4,
                    data: {
                        content: `✅ | <@!${params.interaction.member.user.id}>, foi adicionado 🪙 **${Math.floor(auxilio_coins).toLocaleString('pt-br', {minimumFractionDigits: 0})}** coins ao auxílio, o valor atual agora é de 🪙 **${Math.floor(_guild.auxilio + auxilio_coins).toLocaleString('pt-br', {minimumFractionDigits: 0})}** coins.`,
                        flags: 64
                    }
                }), this.client.options.editOriginalMessage(cacheMessage.data.interaction.application_id, cacheMessage.data.interaction.token, {
                    embeds: [await embed_1()]
                })
            }
            case "config:imposto:questions": {
                let imposto_porcentagem = Number(params.interaction.getQuestion(0, "config:imposto:q1"))
                if(isNaN(imposto_porcentagem)){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, porcentagem tem que ser um número valido`,
                            flags: 64
                        }
                    })
                } else if(imposto_porcentagem < 0){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>,  porcentagem mínima é de **1**%`,
                            flags: 64
                        }
                    })
                } else if(imposto_porcentagem > 20){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, porcentagem maxíma é de **20**%.`,
                            flags: 64
                        }
                    })
                } else if(imposto_porcentagem == _guild.imposto){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, porcentagem citada é a mesma que a atual.`,
                            flags: 64
                        }
                    })
                }
                await this.client.prisma.guild.update({
                    where: {
                        guild_id: params.interaction.guild_id
                    },
                    data: {
                        imposto: Math.floor(imposto_porcentagem),
                    }
                })
                return params.res.send({
                    type: 4,
                    data: {
                        content: `✅ | <@!${params.interaction.member.user.id}>, porcentagem foi alterada, de **${_guild.imposto}**% para **${Math.floor(imposto_porcentagem)}**%.`,
                        flags: 64
                    }
                }), this.client.options.editOriginalMessage(cacheMessage.data.interaction.application_id, cacheMessage.data.interaction.token, {
                    embeds: [await embed_1()]
                }) 
            }
            case "config:level_update": {
                let level = this.client.cache.levelGuilds[_guild.level + 1]
                if((_guild.level + 1) > this.client.cache.client.db.levelMax){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, o servidor atingiu o seu level máximo`,
                            flags: 64
                        }
                    })
                }
                if(_guild.money < level.value){
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `❌ | <@!${params.interaction.member.user.id}>, o servidor não possuí coins suficiente, o valor do level é de 🪙 **${level.value.toLocaleString('pt-br', {minimumFractionDigits: 0})}** coins.`,
                            flags: 64
                        }
                    })
                }
                await this.client.prisma.guild.update({
                    where: {
                        guild_id: params.interaction.guild_id
                    },
                    data: {
                        level: (_guild.level + 1),
                        money: {
                            decrement: level.value
                        }
                    }
                })
                return params.res.send({
                    type: 4,
                    data: {
                        content: `✅ | <@!${params.interaction.member.user.id}>, o servidor upou de nível, do level **${_guild.level}** para o level **${_guild.level + 1}**.`,
                        flags: 64
                    }
                }), this.client.options.editOriginalMessage(cacheMessage.data.interaction.application_id, cacheMessage.data.interaction.token, {
                    embeds: [await embed_1()]
                }) 
                
            }
        }
    }
}