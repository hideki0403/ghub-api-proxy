import { randomUUID } from 'crypto'
import { getDevices } from '@/manager'
import logger from '@/logger'
import type { SocketStream } from '@fastify/websocket'
import type WebSocket from 'ws'

const log = logger('WebsocketServer')
const connections: Map<string, WebSocket> = new Map()

export async function handler(connection: SocketStream) {
    const uuid = randomUUID()
    const socket = connection.socket
    connections.set(uuid, socket)

    log.info(`New connection (${uuid})`)
    send('update', getDevices(), uuid)

    socket.on('close', () => {
        connections.delete(uuid)
        log.info(`Connection closed (${uuid})`)
    })

    socket.on('message', (message) => {
        let msg: ReceiveMessage

        try {
            msg = JSON.parse(message.toString())
        } catch (error) {
            return
        }
        
        switch (msg.type) {
            case 'ping': {
                send('ping', 'pong', uuid)
                break
            }
            case 'fetch': {
                send('update', getDevices(), uuid)
                break
            }
        }
    })
}

export function send(type: SendMessage['type'], body: SendMessage['body'], uuid?: string) {
    const msg = JSON.stringify({
        type,
        body
    })

    log.debug(`Sending message to ${uuid ?? 'broadcast'} (type: ${type})`)

    if (uuid) {
        const socket = connections.get(uuid)
        if (!socket) return
        socket.send(msg)
    } else {
        connections.forEach(x => x.send(msg))
    }
}

type SendMessage = {
    type: 'ping' | 'update',
    body: any
}

type ReceiveMessage = {
    type: 'ping' | 'fetch',
    body: any
}