import { APIMessage, APIUser, Routes } from "discord-api-types/v10"
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
    async getUser(userID: string): Promise<void> {
        let user = this.client.cache.users[userID]
        if(user){
            return user
        } else {
            user = await this.client.rest.get(Routes.user(userID)).catch((e: any) => e)
            this.client.cache.users[user.id] = user
            console.log(`[GET APIUser] ${user.id}`)
            return user
        }
    }
    async getMembers(guildID: string,userID: string): Promise<void> {
        let member = this.client.cache.guilds[guildID].members[userID]
        if(member){
            return member
        } else {
            member = await this.client.rest.get(Routes.guildMember(guildID, userID)).catch((e: any) => e)
            this.client.cache.guilds[guildID].members[userID] = member
            return member
        }
    }
    async registerCommands(commands: any): Promise<void> {
        let putCommands = await this.client.rest.put(Routes.applicationCommands(this.client.config.discordCLIENTId), {
            body: commands
        }).catch((e: any) => e)
        return putCommands
    }
    async createMessage(channel_id: string, data: any): Promise<void> {
        let message = await this.client.rest.post(Routes.channelMessages(channel_id),{
            body: data
        }).catch((e: any) => console.log(e))
        return message
    }
    async editMessage(channel_id: string, message_id: string, newMessageData: any): Promise<void> {
        let newMessage = await this.client.rest.post(Routes.channelMessageCrosspost(channel_id, message_id),{
            body: newMessageData
        }).catch((e: any) => e)
        return newMessage
    }
    async editOriginalMessage(interaction_id: string, interaction_token: string, newBody: any){
        let newInteractionMessage = await this.client.rest.patch(Routes.webhookMessage(interaction_id, interaction_token),{
            body: newBody
        }).catch((e: any) => e)
        return newInteractionMessage
    }

}
export { _client }