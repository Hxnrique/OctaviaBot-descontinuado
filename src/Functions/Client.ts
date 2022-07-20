import { APIGuildMember, APIUser, CDNRoutes, Routes, UserPremiumType } from "discord-api-types/v10"
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
    async getUser(userID: string): Promise<APIUser> {
        let user = this.client.cache.users[userID]
        if(user){
            return user
        } else {
            user = await this.client.rest.get(Routes.user(userID))
            this.client.cache.users[user.id] = user
            console.log(`[GET APIUser] ${user.id}`)
            return user
        }
    }
    async getMembers(guildID: string,userID: string): Promise<APIGuildMember> {
        let member = this.client.cache.users.get(userID)
        if(member){
            return member
        } else {
            member = await this.client.rest.get(Routes.guildMember(guildID, userID))
            this.client.cache.members.set(member.id, member)
            return member
        }
    }
    async registerCommands(commands: any): Promise<void> {
        let putCommands = await this.client.rest.put(Routes.applicationCommands(this.client.config.discordCLIENTId), {
            body: commands
        })
        return putCommands
    }
}
export { _client }