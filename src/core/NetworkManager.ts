import { Engine, Resource } from "@niloc/ecs";
import { Connection } from "./Connection";
import { VideoManager } from "./VideoManager";

export class NetworkManager extends Resource {

    private _connection: Connection | null = null
    private _videoConnected = false
    private _connectedStream: MediaStream | null = null

    protected readonly videoManager: VideoManager

    constructor(engine: Engine) {
        super(engine)
        this.videoManager = this.engine.getResource(VideoManager)

        this.videoManager.on('change', this._onVideoManagerChange)
    }

    get videoConnected() {
        return this._videoConnected
    }

    private _onVideoManagerChange = () => {
        const stream = this.videoManager.mainStream

        if (this._videoConnected && this._connection) {
            if (this._connectedStream === stream)
                return

            if (stream)
                this._connection.local.addStream(stream)
            else
                this._connection.local.removeStream(this._connectedStream!)

            this._connectedStream = stream
        }
    }

    start() {
        this._connection = new Connection(this.engine)
        this.changed()
    }

    stop() {
        if (this._connection) {
            this._connection.destroy()
            this._connection = null
            this._connectedStream = null
        }
        this.changed()
    }

    connectVideo() {
        this._videoConnected = true

    }

    disconnectVideo() {
        this._videoConnected = false
    }

}