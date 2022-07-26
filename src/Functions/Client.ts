import { APIGuild, APIMessage, APIUser, Routes } from "discord-api-types/v10"
import type { Octavia } from "../Client"

class _client {
    client: Octavia
    constructor(client: Octavia){
        this.client = client
    }
    color(cor: string): number {
       return parseInt(cor.toUpperCase().replace('#', ''), 16)
    }
    getAvatarURL(user: APIUser): string {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
    }
    getIconURL(guild: APIGuild): string {
        return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`
    }
    async getUser(user_id: string): Promise<void> {
        if(this.client.cache.users[user_id]){
            return this.client.cache.users[user_id]
        } else {
            let user = await this.client.rest.get(Routes.user(user_id)).catch((e: any) => false)
            if(!user)return user
            this.client.cache.users[user_id] = user
            console.log(`[GET APIUser] ${user.id}`)
            return user
        }
    }
    async getGuild(guild_id: string): Promise<void> {
        if(this.client.cache.guilds[guild_id]._guild){
            this.client.cache.guilds[guild_id]._guild
        } else {
            let guild = await this.client.rest.get(Routes.guild(guild_id)).catch((e: any) => false)
            if(!guild)return guild
            this.client.cache.guilds[guild_id]._guild = guild
            return guild
        }
    }
    async getMember(guild_id: string,user_id: string): Promise<void> {
        if(this.client.cache.guilds[guild_id].members[user_id]){
            return this.client.cache.guilds[guild_id].members[user_id]
        } else {
            let member = await this.client.rest.get(Routes.guildMember(guild_id, user_id)).catch((e: any) => false)
            if(!member)return member
            this.client.cache.guilds[guild_id].members[user_id] = member
            this.client.cache.users[user_id] = member.user
            console.log(`[GET APIMember] ${member.user.id}`)
            return member
        }
    }
    async getSlashCommands(): Promise<void> {
        return await this.client.rest.get(Routes.applicationCommands(process.env.DISCORD_BOT_ID as string)).catch((e: any) => e)
    }
    async registerCommands(commands: any): Promise<void> {
       return await this.client.rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID as string), {
            body: commands
        }).catch((e: any) => e)
    }
    async createMessage(channel_id: string, data: any): Promise<void> {
        return await this.client.rest.post(Routes.channelMessages(channel_id),{
            body: data
        }).catch((e: any) => false), console.log(`[GET APIMessage] ${channel_id}`)
    }
    async editMessage(channel_id: string, message_id: string, newMessageData: any): Promise<void> {
        return await this.client.rest.patch(Routes.channelMessage(channel_id, message_id),{
            body: newMessageData
        }).catch((e: any) => false), console.log(`[GET APIEDITMessage] ${channel_id}`)
    }
    async editOriginalMessage(interaction_id: string, interaction_token: string, newBody: any){
        return await this.client.rest.patch(Routes.webhookMessage(interaction_id, interaction_token),{
            body: newBody
        }).catch((e: any) => false), console.log(`[GET APIEDITORIGINALMessage] ${interaction_id}`)
    }

}
export { _client }