import Koa from "koa"
import Router from "@koa/router"
export default class OctaviaWeb extends Koa {
    router: any
    constructor(){
        super()
        this.router = new Router()
    }
    async start(): Promise<void> {
        this.loadRouters()
        this.use(this.router.routes()).use(this.router.allowedMethods())
        this.listen(process.env.token)
    }
    async loadRouters(): Promise<void> {
        this.router.get("/", (ctx: any, next: any) => {
            ctx.body = "a"
            next()
        })
        this.router.post("/interaction", (ctx: any, next: any) => {
            ctx.status = 200
            console.log(ctx)
        })
    }
}