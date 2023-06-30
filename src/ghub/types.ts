export type WsResponse = {
    msgId: string,
    origin: string,
    path: string,
    payload?: DeviceInfo | DeviceInfoList | Battery
    result?: {
        code: string,
        what: string,
    },
    verb: 'GET' | 'SET' | 'BROADCAST',
}

// type.googleapis.com/logi.protocol.devices.Device.Info
export type DeviceInfo = {
    '@type': 'type.googleapis.com/logi.protocol.devices.Device.Info',
    id: string,
    pid: number,
    state: string,
    connectionType: string,
    displayConnectionType: string,
    deviceType: string,
    deviceModel: string,
    displayName: string,
    extendedDisplayName: string,
    deviceSignature: string,
    path: string,
}


// type.googleapis.com/logi.protocol.devices.Device.Info.List
export type DeviceInfoList = {
    '@type': 'type.googleapis.com/logi.protocol.devices.Device.Info.List',
    deviceInfos: DeviceInfo[],
}

// type.googleapis.com/logi.protocol.wireless.Battery
export type Battery = {
    '@type': 'type.googleapis.com/logi.protocol.wireless.Battery',
    deviceId: string,
    percentage: number,
    mileage: number,
    maxLifeSpan: number,
    charging: boolean,
    simpleBattery: boolean,
    criticalLevel: boolean,
    chargingError: boolean,
}