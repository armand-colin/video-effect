import { Engine, Resource } from "@niloc/ecs";

export class DeviceList extends Resource {

    private _devices: MediaDeviceInfo[] = []

    constructor(engine: Engine) {
        super(engine)
        navigator.mediaDevices.addEventListener("devicechange", this.request)
    }

    get devices(): ReadonlyArray<MediaDeviceInfo> {
        return this._devices
    }

    request = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        this._devices = devices
        this.changed()
    }

    destroy() {
        navigator.mediaDevices.removeEventListener("devicechange", this.request)
    }

}