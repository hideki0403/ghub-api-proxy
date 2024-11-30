import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function (req: FastifyRequest, res: FastifyReply) {
    await res.send('Shutting down...')
    process.exit(0)
}