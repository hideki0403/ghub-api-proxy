import type { DeviceInfo, Battery } from '@/ghub/types'
import GHub from '@/ghub'

const ghub = GHub.getInstance()

export const devices = new Map<string, DeviceInfo>()
export const batteries = new Map<string, Battery>()

export function updateDevice(device: DeviceInfo) {
    switch (device.state) {
        case 'ACTIVE': {
            devices.set(device.id, device)
            ghub.get(`/battery/${device.id}/state`)
            break
        }

        case 'ABSENT': {
            devices.delete(device.id)
            batteries.delete(device.id)
            break
        }

        case 'NOT_CONNECTED': {
            batteries.delete(device.id)
            break
        }

        default: {
            devices.set(device.id, device)
            break
        }
    }
}

export function updateBattery(batteryInfo: Battery) {
    batteries.set(batteryInfo.deviceId, batteryInfo)
}

export function getDevices() {
    return Array.from(devices.values()).map((device) => {
        const battery = batteries.get(device.id)

        return {
            ...device,
            battery,
        }
    })
}

export function getDevice(id: string) {
    const device = devices.get(id)
    const battery = batteries.get(id)

    return {
        ...device,
        battery,
    }
}