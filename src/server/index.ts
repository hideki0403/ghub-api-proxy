import Fastify from 'fastify'
import FastifyWebsocket from '@fastify/websocket'
import logger from '@/logger'
import endpoints from './endpoint'
import * as websocket from './websocket'

const log = logger('Server')

export default async function () {
    const app = Fastify()
    app.register(FastifyWebsocket)

    app.setErrorHandler((err, req, res) => {
        log.error(`RequestID: ${req.id},`, err)
        res.status(500).send(`Internal Server Error (RequestID: ${req.id})`)
    })

    Object.keys(endpoints).forEach((path) => {
        const endpoint = endpoints[path]
        app.get(path, endpoint)
    })

    app.register(fastify => fastify.get('/ws', { websocket: true }, websocket.handler))

    app.listen({
        port: 3010, // Number(config.port) || 3000,
        host: '0.0.0.0'
    }, (err, address) => {
        if (err) {
            log.error(err)
            process.exit(1)
        }

        log.info(`Server listening at ${address}`)
    })
}