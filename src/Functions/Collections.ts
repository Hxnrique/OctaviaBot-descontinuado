import { APIUser } from "discord-api-types/v10";

let Collections = Object({
    users: {
        get: (userId: string) => {
            return Collections.users[userId]
        }
    },
    guilds: {
        get(guild_id: string) {
            return Collections.guilds[guild_id]
        }
    },
    levelGuilds: {
        "2": {
            value: 15000
        },
        "3": {
            value: 30000
        }
    },
    messageComponents: {
        get(interaction_id: string){
            return Collections.messageComponents[interaction_id]
        },
        set(interaction_id: string, data: any){
            return Collections.messageComponents[interaction_id] = {
                data
            }
        }
    }
})

export { Collections }