import { Component, Engine } from "@niloc/ecs";
import { Emitter } from "@niloc/utils";

export class Video extends Component {

    readonly stream: MediaStream
    readonly events = new Emitter<{ ended: void }>()

    private _element: HTMLVideoElement | null = null

    constructor(engine: Engine, stream: MediaStream) {
        super(engine)
        this.stream = stream

        for (const track of this.stream.getTracks()) {
            track.addEventListener('ended', () => {
                this.events.emit('ended')
            })
        }
    }

    get element() {
        if (!this._element) {
            this._element = document.createElement("video")
            this._element.autoplay = true
            this._element.playsInline = true
            this._element.srcObject = this.stream
        }

        return this._element
    }

    destroy() {
        super.destroy()
        this.events.removeAllListeners()
    }

}
