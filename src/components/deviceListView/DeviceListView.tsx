import { useResource } from "@niloc/ecs-react";
import { DeviceList } from "../../core/DeviceList";
import "./DeviceListView.scss";

type Props = {
	onDeviceSelected: (deviceId: string) => void
}

export function DeviceListView(props: Props) {
	const deviceList = useResource(DeviceList)

	return <div className="DeviceListView">
		<button onClick={() => deviceList.request()}>refresh</button>
		<ul>
			{
				deviceList.devices
					.filter(device => device.kind === "videoinput")
					.map(device => (
						<li
							key={device.deviceId}
							onClick={() => props.onDeviceSelected(device.deviceId)}
						>
							{device.label || "Unknown Device"}
						</li>
					))
			}
		</ul>
	</div>
}
