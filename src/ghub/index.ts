import ws from 'ws'
import ReconnectingWebSocket, { type ErrorEvent } from 'reconnecting-websocket'
import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'
import type { WsResponse } from './types'

export default class GHub extends (EventEmitter as { new(): StrictEventEmitter<EventEmitter, GHubEvents> }) {
    private static instance: GHub
    private ws: ReconnectingWebSocket
    private messageId: number = 1

    private constructor(url = '127.0.0.1', port = 9010) {
        super()

        this.ws = new ReconnectingWebSocket(`ws://${url}:${port}`, 'json', {
            WebSocket: createWebSocket({
                origin: 'file://'
            }),

        })

        this.ws.onopen = () => this.emit('connected')
        this.ws.onclose = () => this.emit('disconnected')
        this.ws.onerror = (error) => this.emit('error', error)
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            this.emit('message', message)
        }
    }

    public static getInstance() {
        if (!GHub.instance) {
            GHub.instance = new GHub()
        }

        return GHub.instance
    }

    private send(args: SendArgs) {
        this.ws.send(JSON.stringify({
            msg_id: (this.messageId++).toString(),
            ...args,
        }))
    }

    subscribe(path: string) {
        this.send({
            verb: 'SUBSCRIBE',
            path,
        })
    }

    get(path: string, payload?: Record<string, string>) {
        this.send({
            verb: 'GET',
            path,
            payload,
        })
    }

    set(path: string, payload: Record<string, string>) {
        this.send({
            verb: 'SET',
            path,
            payload,
        })
    }
}

function createWebSocket(options?: ws.ClientOptions) {
    return class WebSocket extends ws {
        constructor(url: string, protocols?: string | string[]) {
            super(url, protocols, options)
        }
    }
}

interface GHubEvents {
    connected: () => void,
    disconnected: () => void,
    message: (message: WsResponse) => void,
    error: (error: ErrorEvent) => void,
}

type SendArgs = {
    path: string,
    verb: 'GET' | 'SET' | 'SUBSCRIBE',
    payload?: Record<string, string>,
}