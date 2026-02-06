import { Component, type Engine } from "@niloc/ecs";
import { SegmentationModel } from "./SegmentationModel";
import type { Video } from "./Video";

export type VideoEffectOptions = {
    foregroundThreshold: number,
    blurAmount: number,
    edgeBlurAmount: number,
    flipHorizontal: boolean,
    background: Background | null,
    maskOpacity: number
}

export namespace VideoEffectOptions {

    export function scaffold(): VideoEffectOptions {
        return {
            foregroundThreshold: 0.7,
            blurAmount: 15,
            edgeBlurAmount: 3,
            flipHorizontal: false,
            background: null,
            maskOpacity: 1
        }
    }

}

export type Background = {
    type: "color",
    r: number,
    g: number,
    b: number
} | {
    type: "image",
    src: string
}

export class VideoEffect extends Component {

    private _canvas: HTMLCanvasElement
    private _stream: MediaStream | null = null
    private _video: Video | null = null
    private _animationFrame: number | null = null

    private _options: VideoEffectOptions = VideoEffectOptions.scaffold()

    protected readonly model: SegmentationModel

    constructor(engine: Engine) {
        super(engine)
        this._canvas = document.createElement("canvas")
        this.model = engine.getResource(SegmentationModel)
    }

    get stream() {
        if (!this._stream)
            this._stream = this._canvas.captureStream()

        return this._stream
    }

    get options() {
        return this._options
    }

    applyOptions(options: Partial<VideoEffectOptions>) {
        this._options = { ...this._options, ...options }
        this.changed()
    }

    bind(video: Video | null) {
        this._video = video
        if (!this._video)
            this._stop()
        else
            this._start()
    }

    private _start() {
        if (this._animationFrame)
            return

        this._animationFrame = requestAnimationFrame(this._render)
    }

    private _stop() {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame)
            this._animationFrame = null
        }
    }

    private _render = async () => {
        if (!this._video)
            return

        const video = this._video.element

        if (this._options.background) {
            await this.model.alpha(
                video,
                this._canvas,
                {
                    foregroundThreshold: this._options.foregroundThreshold,
                    flipHorizontal: this._options.flipHorizontal,
                    maskOpacity: this._options.maskOpacity,
                    maskBlurAmount: this._options.edgeBlurAmount,
                    background: this._options.background
                }
            )
        } else {
            await this.model.blur(
                video,
                this._canvas,
                {
                    blurAmount: this._options.blurAmount,
                    edgeBlurAmount: this._options.edgeBlurAmount,
                    flipHorizontal: this._options.flipHorizontal,
                    foregroundThreshold: this._options.foregroundThreshold
                }
            )
        }

        this._animationFrame = requestAnimationFrame(this._render)
    }

    destroy() {
        this._stop()
    }

}