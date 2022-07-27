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
                let _job = await this.client.prisma.userJobs.create({
                    data: {
                        job_name: empregos[0].name,
                        job_earn: empregos[0].maxEarn,
                        job_experience_max: empregos[0].experience,
                        job_experience: 0,
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
                            max_values: 1,
                            min_values: 1
                        }]
                    }],
                }
            })
        }
    }
    async runCollection(parans: any): Promise<void> {

    }
}