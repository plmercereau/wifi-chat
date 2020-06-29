import { Zeroconf } from 'app/src-capacitor/node_modules/@ionic-native/zeroconf'
import { Module } from '../types'
import { log } from './utils'
import { startServer, stopServer } from './server'
import { publish, unpublish, watch, unwatch } from './mdns'
// import { Plugins } from '@capacitor/core'
// import 'app/src-capacitor/node_modules/capacitor-enumerate-media-devices'
// const { EnumeratePlugin } = Plugins

// const enumerateDevices: () => Promise<MediaDeviceInfo[]> = async () => {
//   const navDevices = await navigator.mediaDevices.enumerateDevices()
//   console.log(navDevices)
//   navDevices.forEach(d => {
//     console.log(d)
//   })
//   const capDevices = (await EnumeratePlugin.enumerateDevices()).devices
//   const result: MediaDeviceInfo[] = []
//   const navMicroDevices = navDevices.filter(d => d.kind === 'audioinput')
//   const capMicroDevices = capDevices.filter(d => d.kind === 'audioinput')
//   const navCameraDevices = navDevices.filter(d => d.kind === 'videoinput')
//   const capCameraDevices = capDevices.filter(d => d.kind === 'videoinput')
//   for (const [nav, cap] of [
//     [navMicroDevices, capMicroDevices],
//     [navCameraDevices, capCameraDevices]
//   ]) {
//     cap.forEach((value, index) =>
//       result.push({
//         ...value,
//         deviceId: nav[index].deviceId,
//         groupId: nav[index].groupId
//       })
//     )
//   }
//   return result
// }

const capacitorModule: Module = {
  defaultName: () => Zeroconf.getHostname(),
  startServer,
  stopServer,
  publish,
  unpublish,
  watch,
  unwatch,
  log
  // enumerateDevices
}

export default capacitorModule
