import { Component, Engine } from "@niloc/ecs";
import { Emitter } from "@niloc/utils";
import SimplePeer, { type Instance } from "simple-peer";
import { Video } from "./Video";

export class Peer extends Component {

    readonly local: boolean
    readonly events = new Emitter<{ signal: any }>()

    private _instance: Instance
    private _videos: Video[] = []

    constructor(engine: Engine, opts: { local: boolean }) {
        super(engine)
        this.local = opts.local

        this._instance = new SimplePeer({ initiator: this.local })

        this._instance.on("signal", signal => {
            this.events.emit('signal', signal)
        })

        this._instance.on('stream', stream => {
            const video = new Video(this.engine, stream)

            video.events.on('ended', () => {
                const index = this._videos.indexOf(video)
                if (index !== -1) {
                    this._videos.splice(index, 1)
                    this.changed()
                }
            })

            this._videos.push(video)
            this.changed()
        })
    }

    get videos() {
        return this._videos
    }

    addStream(stream: MediaStream) {
        this._instance.addStream(stream)
    }

    removeStream(stream: MediaStream) { 
        this._instance.removeStream(stream)
    }

    signal(signal: any) {
        this._instance.signal(signal)
    }

    destroy() {
        this._instance.removeAllListeners()
        this._instance.destroy()
        this.events.removeAllListeners()

        for (const video of this._videos)
            video.destroy()

        this._videos = []
    }

}