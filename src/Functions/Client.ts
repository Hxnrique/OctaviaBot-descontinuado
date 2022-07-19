import axios, { AxiosResponse } from "axios"
import { APIUser, Routes } from "discord-api-types/v10"
import config from "../../config"
import Collection from "./Collections"
export default {
    getUser: async (id: string) => {
        let user = Collection.users.get(id)
        let resp: any;
        if(!user){
            await axios({
                method: "GET",
                url: `${config.discordAPIVersion}/${Routes.user(id)}`,
                headers: {
                    Authorization: config.discordToken,
                    "User-Agent": config.discordUSERAgent,
                    'Content-Type': 'application/json',
                }
            }).then((response: AxiosResponse) => {
                Collection.users.set(response.data.id, response.data)
                resp = Collection.users.get(id)
            }).catch(() => false)
        } else {
            resp = user
        }
        return resp
    },
    getAvatarURL: (user: APIUser) => {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
    },
    color(cor: string): number {
        return parseInt(cor.toUpperCase().replace('#', ''), 16)
    },
}