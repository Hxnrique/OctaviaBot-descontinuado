import { APIUser } from "discord-api-types/v10";

let Collections = Object({
    users: {
        get: (userId: string) => {
            return Collections.users[userId]
        }
    },
    guilds: {}
})

export { Collections }