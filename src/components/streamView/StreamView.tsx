import { useEffect, useRef } from "react";
import "./StreamView.scss";

type Props = {
	stream: MediaStream
}

export function StreamView(props: Props) {
	const ref = useRef<HTMLVideoElement | null>(null)

	function onRef(element: HTMLVideoElement | null) {
		ref.current = element
		if (element)
			element.srcObject = props.stream
	}

	useEffect(() => {
		if (ref.current)
			ref.current.srcObject = props.stream
	}, [props.stream])

	return <div className="StreamView">
		<video
			ref={onRef}
			autoPlay
		/>
	</div>
}
