import { Command } from "../../Handlers/Command";
import type { Octavia } from "../../WebServer"
import { Client } from "../../Functions";
import { loadavg } from "node:os";
export default class BotCommand extends Command {
	constructor(Client: Octavia){
		super(Client,{
			name: "bot",
		})
	}
	async run(params: any): Promise<void> {
		if(params.interaction.getString("info")){
			let _client = await Client.getUser(this.client.config.discordCLIENTId)
			params.res.send({
				type: 4,
				data: {
					embeds: [{
						color: this.client.color,
						fields: [
							{
								value: `Olá <@!${params.interaction.member.user.id}>, eu sou a **${_client.username}**, um bot de economia global e local para seu servidor.`,
								name: "🚪| Boas-vindas e Sobre mim"
							},
							{
								name: "🛏️ | Sobre meu quarto",
								value: `Ram: **${(process.memoryUsage().rss/1024/1024).toFixed(0)}**mb\nCpu: **${loadavg()[0].toFixed(0)}**%\nUptime: <t:${Math.floor(( Date.now() - this.client.uptime()) / 1000)}:R>`
							},
							{
								name: "🔧 | Ferramentas utilizadas",
								value: `Linguagem: **[TypeScript](https://www.typescriptlang.org/)**\nLinguagem de programação: **[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)**`
							},
							{
								name: "💡| Tudo e mais um pouco",
								value: "Database: **[mongodb](https://www.mongodb.com/pt-br)**\nVersão da api do Discord: **v10**\nBiblioteca auxiliar: **[discord-api-types](https://discord-api-types.dev/)**\nHospedagem: **[Heroku](https://www.heroku.com/)**"
							}
						],
						author: { name: _client.username, icon_url: Client.getAvatarURL(_client) }
					}],
					components: [{
						type: 1,
						components: [
							{
								type: 2,
								label: "Convite",
								style: 5,
								url: `https://discord.com/api/oauth2/authorize?client_id=${_client.id}&permissions=0&scope=bot%20applications.commands`
							},
							{
								type: 2,
								label: "Suporte",
								style: 5,
								url: "https://discord.gg/TmUrvsCtnP"
							}
						]
					}]
				}
			})
		}
	}
}