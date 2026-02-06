import type { VideoEffect } from "../../core/VideoEffect";
import { StreamView } from "../streamView/StreamView";
import "./VideoEffectView.scss";

type Props = {
	effect: VideoEffect
}

export function VideoEffectView(props: Props) {
	return <div className="VideoEffectView">
		<StreamView stream={props.effect.stream} />
	</div>
}
