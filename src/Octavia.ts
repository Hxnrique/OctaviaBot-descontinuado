import OctaviaWeb from "./WebServer";

new OctaviaWeb().start()
setInterval(() => {
    console.log((process.memoryUsage().rss/1024/1024).toFixed(0))
}, 10000)
