import type { FastifyReply, FastifyRequest } from 'fastify'
import devices from './endpoints/devices'

const endpoints: Record<string, (req: FastifyRequest, res: FastifyReply) => Promise<void>> = {
    '/devices': devices,
}

export default endpoints