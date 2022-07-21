import { Octavia } from "../../Client";
import { Command } from "../../Handlers/Command";
import { inspect } from "util";
export default class DevCommand extends Command {
    constructor(Client: Octavia){
        super(Client, {
            name: "dev",
            data: {
                type: 1,
                name: "dev",
                description: "[⚙️] Comandos uteis para meus desenvolvedores.",
                options: [{
                    type: 1,
                    description: "[🔧 Eval ] Teste scripts js na Octavia",
                    name: "eval"
                }]
            }
        })
    }
    async run(params: any): Promise<any> {
        if(params.interaction.member.user.id !== "485101049548636160"){
            return params.res.send({
                type: 4,
                data: {
                    content: `<@!${params.interaction.member.user.id}>, esse comando é apenas para meus desenvolvedores.`,
                    flags: 64,
                }
            })
        }
        if(params.interaction.getString("eval")){
            params.res.send({
                type: 9,
                data: {
                    title: "Eval",
                    custom_id: "dev:question1",
                    components: [{
                        type: 1,
                        components: [{
                            type: 4,
                            custom_id: "eval:code",
                            label: "Código",
                            style: 1,
                            min_length: 1,
                            max_length: 4000,
                            placeholder: "Digite o script aqui",
                            required: true
                        }]
                    }]
                }
            })
        }
    }
    async runCollection(params: any): Promise<void> {
        switch(params.interaction.data.custom_id){
            case "dev:question1": {
                let code: any;
                if(params.interaction.getQuestion(0, "eval:code")){
                    code = params.interaction.getQuestion(0, "eval:code")
                }
                let _eval: any
                try {
                    _eval = eval(code)
                } catch(e){
                    _eval = e
                }
                params.res.send({
                    type: 4,
                    data: {
                        content: "```" + inspect(_eval).slice(0, 1900) + "```",
                        flags: 64
                    }
                })
            }
        }
    }
}