import { useResource } from '@niloc/ecs-react'
import './App.css'
import { DeviceListView } from './components/deviceListView/DeviceListView'
import { StreamView } from './components/streamView/StreamView'
import { VideoEffectSelectorView } from './components/videoEffectSelectorView/VideoEffectSelectorView'
import { VideoEffectView } from './components/videoEffectView/VideoEffectView'
import { VideoManager } from './core/VideoManager'

function App() {
  const videoManager = useResource(VideoManager)

  function onDeviceSelected(deviceId: string) {
    videoManager.request(deviceId)
  }

  return <div className="App">
    <DeviceListView
      onDeviceSelected={onDeviceSelected}
    />

    {
      videoManager.video ?
        <StreamView stream={videoManager.video.stream} /> :
        undefined
    }

    <VideoEffectSelectorView />

    {
      videoManager.effect ?
        <VideoEffectView effect={videoManager.effect} /> :
        undefined
    }
  </div>
}

export default App
