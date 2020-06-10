declare class Socket {
  constructor()
  close: () => void
  open: (
    host: string,
    port: number,
    onSuccess?: Function,
    onError?: Function
  ) => void
  onClose: Function
  onError: Function
  onData: Function
}

declare namespace Socket {}

declare module 'app/src-capacitor/node_modules/cordova-plugin-socket-tcp/socket' {
  export = Socket
}
