import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDevices } from '@/manager'

export default async function (req: FastifyRequest, res: FastifyReply) {
    res.send(getDevices())
}