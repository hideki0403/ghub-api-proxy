import type { FastifyReply, FastifyRequest } from 'fastify'
import devices from './endpoints/devices'
import shutdown from './endpoints/shutdown'

const endpoints: Record<string, (req: FastifyRequest, res: FastifyReply) => Promise<void>> = {
    '/devices': devices,
    '/shutdown': shutdown,
}

export default endpoints