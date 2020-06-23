# TODO list

## Must

- [ ] network/wifi
- [ ] auto-answer option
- [ ] auto-call option
- [ ] prompts to allow network connections on electron startup: use the same thread (remote?) -> sign electron app?
- [ ] block sending messages when server is disconnected/not available - queue them at a later stage
- [ ] root disconnect/connect vuex actions
- [ ] why all those udp errors in electron dev mode?
- [x] sort the list by status - available first, busy second, disconnected at last
- [x] i18n
- [x] i18n: moment
- [x] i18n: change in settings
- [ ] i18n: select on initial start
- [ ] scroll problem when list update (from poll)
- [ ] settings: reset
- [ ] play sound and vibrations when ringing
- [ ] change front/rear camera
- [ ] settings: select camera/microphone: show a screen with the mic and video, and dropdown lists of the possible devices. Then persist the selected device ids.
- [ ] show audio waves instead of video when video is off - of show avatar?
- [x] capture avatar in electon. See https://capacitor.ionicframework.com/docs/pwa-elements/
- [x] mirror call/ring actions
- [x] reconnect when connection is lost
- [x] poll unconnected servers
- [x] get rid of netcat/checkServer as it is implied when ws connection succeeds/fails
- [x] archive offline servers when no messages history
- [x] swipe item to call
- [x] show chat duration
- [x] stop using immutable in the servers vuex module, and uninstall the immutable package
- [x] mute/unmute call
- [x] turn the camera on/off
- [x] start/stop video during call
- [x] block calls when server is disconnected/not available
- [x] first chat message is not set in the getter
- [x] on start, remote server stays connected in the list (persisted that way)
- [x] set 'busy' status when calling
- [x] root pickup/hangup vuex actions

## Less important

- [ ] add calls information (rejected/stared + duration) to chat messages
- [ ] implement WSS?
- [ ] limit animations in quasar.conf to the ones that are actually used
- [ ] swipe item to archive/delete? -> find a way to clean the list of former/disconnected devices
- [x] add more composable methods
- [ ] change http(s) mDNS service type to something else e.g. ws(s) or a custom type
- [ ] call buttons on the left or right side of the screen depending on its size
- [ ] change favicons
