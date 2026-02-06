import { useComponent, useResource } from "@niloc/ecs-react";
import type { ChangeEvent } from "react";
import { Instance } from "../../Instance";
import { VideoEffect, VideoEffectOptions } from "../../core/VideoEffect";
import { VideoManager } from "../../core/VideoManager";
import "./VideoEffectSelectorView.scss";

type Props = {

}

export function VideoEffectSelectorView(props: Props) {
	const videoManager = useResource(VideoManager)

	function onAddEffect() {
		const engine = Instance.engine
		const effect = new VideoEffect(engine)
		videoManager.applyEffect(effect)
	}

	return <div className="VideoEffectSelectorView">
		{
			!videoManager.effect ?
				<button onClick={onAddEffect}>add effect</button> :
				undefined
		}
		{
			videoManager.effect ?
				<>
					<button onClick={() => videoManager.applyEffect(null)}>remove effect</button>

					<VideoEffectOptionsView effect={videoManager.effect} />
				</> :
				undefined
		}
	</div>
}

function VideoEffectOptionsView(props: { effect: VideoEffect }) {
	const { options } = useComponent(props.effect)

	function onChange(e: ChangeEvent<HTMLInputElement>, key: keyof VideoEffectOptions) {
		const value = Number(e.target.value)

		if (!isNaN(value))
			props.effect.applyOptions({ [key]: value })
	}

	return <div className="VideoEffectOptionsView">
		<label>Blur amount</label>
		<input type="range" min={0} max={50} value={options.blurAmount} onChange={e => onChange(e, "blurAmount")} />

		<label>Edge blur amount</label>
		<input type="range" min={0} max={10} value={options.edgeBlurAmount} onChange={e => onChange(e, "edgeBlurAmount")} />

		<label>Foreground threshold</label>
		<input type="range" min={0} max={1} step={0.01} value={options.foregroundThreshold} onChange={e => onChange(e, "foregroundThreshold")} />

		<label>Mask opacity</label>
		<input type="range" min={0} max={1} step={0.01} value={options.maskOpacity} onChange={e => onChange(e, "maskOpacity")} />

		<label>Background</label>
		<ul>
			<li onClick={() => props.effect.applyOptions({ background: null })}>None</li>
			<li onClick={() => props.effect.applyOptions({
				background: {
					type: "color",
					r: 255,
					g: 255,
					b: 255
				}
			})}>White</li>
		</ul>
	</div>
}