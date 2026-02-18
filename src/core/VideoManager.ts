import { Resource } from "@niloc/ecs";
import { Video } from "./Video";
import type { VideoEffect } from "./VideoEffect";

export class VideoManager extends Resource {

    private _video: Video | null = null
    private _effect: VideoEffect | null = null
    private _videoConnected = false

    get video(): Video | null {
        return this._video
    }

    get effect(): VideoEffect | null {
        return this._effect
    }
    
    get mainStream(): MediaStream | null {
        if (this._effect)
            return this._effect.stream
        
        if (this._video)
            return this._video.stream

        return null
    }

    async request(deviceId?: string) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: deviceId ? {
                deviceId: { exact: deviceId },
                width: { ideal: 720 },
            } : true
        })

        this._setVideo(new Video(this.engine, stream))
        this.changed()
    }

    applyEffect(effect: VideoEffect | null) {
        if (this._effect) {
            this._effect.destroy()
            this._effect = null
        }

        this._effect = effect

        if (effect)
            effect.bind(this._video)

        this.changed()
    }

    private _setVideo(video: Video | null = null) {
        if (this._video) {
            this._video.destroy()
            this._video = null
        }

        this._video = video
        this.changed()
    }

}