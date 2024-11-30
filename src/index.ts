import GHub from '@/ghub'
import logger from '@/logger'
import server from '@/server'
import * as DeviceManager from '@/manager'
import * as WebsocketManager from '@/server/websocket'

server()

const log = logger('Websocket')
const ghub = GHub.getInstance()

ghub.on('connected', () => {
    log.info('Websocket is connected, initializing...')

    // Subscribe
    ghub.subscribe('/devices/state/changed')
    ghub.subscribe('/receivers/state/changed')
    ghub.subscribe('/battery/state/changed')

    // Device-list initialisation
    ghub.get('/devices/list')

    log.info('initialized')
})

ghub.on('message', (message) => {
    switch (message.payload?.['@type']) {
        case 'type.googleapis.com/logi.protocol.devices.Device.Info.List': {
            message.payload.deviceInfos.forEach((device) => DeviceManager.updateDevice(device))
            break
        }

        case 'type.googleapis.com/logi.protocol.devices.Device.Info': {
            DeviceManager.updateDevice(message.payload)
            break
        }

        case 'type.googleapis.com/logi.protocol.wireless.Battery': {
            DeviceManager.updateBattery(message.payload)
            break
        }

        default: {
            return
        }
    }

    WebsocketManager.send('update', DeviceManager.getDevices())
})

ghub.on('disconnected', () => {
    log.info('Connection lost, reconnecting...')
})

ghub.on('error', (error) => {
    log.error(error)
})

log.info('Starting...')
log.info(`PID: ${process.pid}`)

process.on('exit', () => {
    log.info('Shutting down...')
    ghub.close()
})
