import Fastify from 'fastify'
import logger from '@/logger'
import endpoints from './endpoint'

const log = logger('Server')

export default async function () {
    const app = Fastify()

    app.setErrorHandler((err, req, res) => {
        log.error(`RequestID: ${req.id},`, err)
        res.status(500).send(`Internal Server Error (RequestID: ${req.id})`)
    })

    Object.keys(endpoints).forEach((path) => {
        const endpoint = endpoints[path]
        app.get(path, endpoint)
    })

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