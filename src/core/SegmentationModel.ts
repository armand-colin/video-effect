import { Resource } from "@niloc/ecs";
import { SupportedModels, createSegmenter, drawBokehEffect, toBinaryMask, type BodySegmenter } from "@tensorflow-models/body-segmentation";

export type BlurOptions = {
    foregroundThreshold: number,
    blurAmount: number,
    edgeBlurAmount: number,
}

export namespace BlurOptions {

    export function scaffold(): BlurOptions {
        return {
            foregroundThreshold: 0.7,
            blurAmount: 15,
            edgeBlurAmount: 3,
        }
    }

}

export type AlphaOptions = {
    foregroundThreshold: number,
    maskBlurAmount: number,
}

export class SegmentationModel extends Resource {

    static createSegmenter() {
        const model = SupportedModels.MediaPipeSelfieSegmentation

        return createSegmenter(model, {
            runtime: "mediapipe",
            solutionPath: "/public/model",
            modelType: "general",
        })
    }

    private static _blurTarget = document.createElement("canvas")

    static blur(canvas: HTMLCanvasElement, image: ImageData, blurAmount: number) {
        this._blurTarget.width = image.width
        this._blurTarget.height = image.height
        this._blurTarget.getContext("2d")!.putImageData(image, 0, 0)

        const context = canvas.getContext("2d")!
        context.filter = `blur(${blurAmount}px)`
        context.drawImage(this._blurTarget, 0, 0)
        context.filter = "none"
    }

    private _segmenter: BodySegmenter | null = null
    private _loader: Promise<BodySegmenter> | null = null

    protected async segmenter(): Promise<BodySegmenter> {
        if (this._segmenter)
            return this._segmenter

        if (this._loader)
            return this._loader

        const loader = SegmentationModel.createSegmenter()
            .then(segmenter => this._segmenter = segmenter)

        this._loader = loader

        return loader
    }

    async blur(video: HTMLVideoElement, canvas: HTMLCanvasElement, options: BlurOptions): Promise<void> {
        const segmenter = await this.segmenter()

        const segmentation = await segmenter.segmentPeople(video)

        await drawBokehEffect(
            canvas,
            video,
            segmentation,
            options.foregroundThreshold,
            options.blurAmount,
            options.edgeBlurAmount,
            false
        )
    }

    async alpha(video: HTMLVideoElement, canvas: HTMLCanvasElement, options: AlphaOptions) {
        const segmenter = await this.segmenter()

        const segmentation = await segmenter.segmentPeople(video)
        const context = canvas.getContext("2d")!

        const maskImage = await toBinaryMask(
            segmentation,
            { r: 0, g: 0, b: 0, a: 255 },
            { r: 0, g: 0, b: 0, a: 0 },
            undefined,
            1 - options.foregroundThreshold
        )

        context.clearRect(0, 0, canvas.width, canvas.height)
        SegmentationModel.blur(canvas, maskImage, options.maskBlurAmount)
        context.globalCompositeOperation = "source-in"
        context.drawImage(video, 0, 0)
        context.globalCompositeOperation = "source-over"
    }

}