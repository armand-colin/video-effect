import { Component, Engine } from "@niloc/ecs";

export class Video extends Component {

    readonly stream: MediaStream
    private _element: HTMLVideoElement | null = null

    constructor(engine: Engine, stream: MediaStream) {
        super(engine)
        this.stream = stream
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

}
