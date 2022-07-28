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
            let empregos_options: Array<any> = []
            for(let level in Object.keys(this.client.cache.levelGuilds)){
                if(level < params.database.guild.level){
                    let _level = this.client.cache.levelGuilds[Number(level) + 1].works
                    let __level: any = Object.keys(_level)

                    empregos.push({
                        name: __level[0],
                        value: _level[__level[0]].value,
                        experience: _level[__level[0]].experience,
                        maxEarn: _level[__level[0]].maxEarn
                    },
                    {
                        name: __level[1],
                        value: _level[__level[1]].value,
                        experience: _level[__level[1]].experience,
                        maxEarn: _level[__level[1]].maxEarn
                    })
                }
            }
            let user = await this.client.prisma.user.findUnique({
                where: {
                    user_id: params.interaction.member.user.id
                },
                include: {
                    jobs: true
                }
            })
            if(!user) user = await this.client.prisma.user.create({
                data: {
                    user_id: params.member.user.id
                },
                include: {
                    jobs: true
                }
            })
            let jobs;
            jobs = user.jobs
            if(!user.jobs[0]){
                let _job = await this.client.prisma.guildMemberJobs.create({
                    data: {
                        job_name: empregos[0].name,
                        job_earn: empregos[0].maxEarn,
                        job_experience_max: empregos[0].experience,
                        job_experience: 0,
                        guild_id: {
                            connect: { guild_id: params.interaction.guild_id}
                        },
                        user_id: {
                            connect: { user_id: params.interaction.member.user.id}
                        }
                    }
                })
                jobs.push(_job)
            }
            jobs.forEach((job: any) => {
                if(job.experience > job.experience_max || job.experience == job.experience){
                    empregos_options.push({
                        label: `${job.job_name}`,
                        value: job.job_name,
                        description: ` Você pode ganhar até: ${job.job_earn.toLocaleString('pt-br', {minimumFractionDigits: 0})}`
                    })
                }
            })
            this.client.cache.messageComponents.set(params.interaction.id,{
                interaction: {
                    id: params.interaction.id,
                    token: params.interaction.token,
                    application_id: params.interaction.application_id
                },
                empregos,
                users: [ params.interaction.member.user.id ]
            })
            return params.res.send({
                type: 4,
                data: {
                    embeds: [{
                        author: {  name: `${this.client.cache.client.user.username} | Work`,icon_url: this.client.options.getAvatarURL(this.client.cache.client.user)},
                        description: `Usuário: **${params.interaction.member.user.username}**\nO usuário possuí: 🪙 **${params.database.guildMember.coins.toLocaleString('pt-br', {minimumFractionDigits: 0})}** Coins`,
                        fields: [{
                            name: `🆙 | Empregos`,
                            value: `O servidor está no level: **${params.database.guild.level}**.\nO servidor possuí: **${empregos.length}** Empregos\nEstá cansado do mesmo emprego? Adquira experiência com o **/work experience**`
                        }],
                        thumbnail: { url: this.client.options.getAvatarURL(params.interaction.member.user)},
                        timestamp: new Date(),
                        footer: { icon_url: this.client.options.getAvatarURL(params.interaction.member.user), text: `Usado por: ${params.interaction.member.user.id}`},
                        color: this.client.color
                    }],
                    components: [{
                        type: 1,
                        components: [{
                            type: 3,
                            custom_id: "work:jobs:select_1",
                            options: empregos_options,
                            placeholder: "Empregos disponíveis para você:",
                            minValues: 1,
                            maxValues: 1
                        }]
                    }],
                }
            })
        }
    }
    async runCollection(params: any): Promise<void> {
        let cacheMessage = this.client.cache.messageComponents.get(params.interaction.message.interaction.id)
        if(!cacheMessage)return params.res.send({
            type: 4,
            data: {
                content: ` | <@!${params.interaction.member.user.id}>, essa interação foi descartada, utilize o comando novamente.`,
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
        switch(params.interaction.data.custom_id){
            case "work:jobs:select_1": {
                let job = cacheMessage.data.empregos.find((a: any) => a.name == params.interaction.data.values[0])
                let user = await this.client.prisma.user.findUnique({
                    where: {
                        user_id: params.interaction.member.user.id
                    },
                    include: {
                        jobs: true,
                        guilds: true
                    }
                })
                if(!user) user = await this.client.prisma.user.create({
                    data: {
                        user_id: params.member.user.id
                    },
                    include: {
                        jobs: true,
                        guilds: true
                    }
                })
                let guildMember = user.guilds.find((a: any) => a.guildMember == params.interaction.guild_id)
                if(!guildMember){
                    guildMember = await this.client.prisma.guildMember.create({
                        data: {
                            guild_id: {
                                connect: { guild_id: params.interaction.guild_id }
                            },
                            user_id: {
                                connect: { user_id: params.interaction.member.user.id}
                            }
                        }
                    })

                }
                if(guildMember.job == "no"){
                    await this.client.prisma.guildMember.update({
                        where: {
                            id: guildMember.id
                        },
                        data: {
                            job: user.jobs.find((a: any) => a.job_name ==  job.name)?.id
                        }
                    })
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `✅ | <@!${params.interaction.member.user.id}>, agora seu novo emprego é o ${job.name}`,
                            flags: 64
                        }
                    }), this.client.options.editOriginalMessage(cacheMessage.data.interaction.application_id, cacheMessage.data.interaction.token, {
                        embeds: [],
                        components: [],
                        content: "❌"
                    }) 
                } else {
                    if(user.jobs.find((a: any) => a.id ==  guildMember?.job)){
                        return params.res.send({
                            type: 4,
                            data: {
                                content: `❌ | <@!${params.interaction.member.user.id}>, não é possível pegar este emprego, você ja está nele.`,
                                flags: 64
                            }
                        })
                    }
                    if((Date.now() - (new Date(guildMember.timers_work).getTime()) - (600000)) < 0){
                        let time = Math.floor((new Date(guildMember.timers_work).getTime() / 1000) + 600)
                        return params.res.send({
                            type: 4,
                            data: {
                                content: `❌ | <@!${params.interaction.member.user.id}>, você ja está em um emprego, espere o slowmode dele acabar. Volte aqui <t:${time}:R>, estou esperando você.`,
                                flags: 64
                            }
                        })
                    }
                    await this.client.prisma.guildMember.update({
                        where: {
                            id: guildMember.id 
                        },
                        data: {
                            job: user.jobs.find((a: any) => a.job_name ==  job.name)?.id
                        }
                    })
                    return params.res.send({
                        type: 4,
                        data: {
                            content: `✅ | <@!${params.interaction.member.user.id}>, agora seu novo emprego é o ${job.name}`,
                            flags: 64
                        }
                    }), this.client.options.editOriginalMessage(cacheMessage.data.interaction.application_id, cacheMessage.data.interaction.token, {
                        embeds: [],
                        components: [],
                        content: "❌"
                    }) 
                }
            }
        }
    }
}