# Wifi Video Chat

Peer to peer video chat without servers or internet

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Call processes

#### A calls B

```
A: store.ring(initator=true)
    -> A: peer.ring()
        -> B: peer.onRing
        -> B: store.ring
            -> B: shows 'A is calling your' + 'answer' + 'reject' buttons
        -> A: shows 'calling B' + 'cancel' button
```

#### B pickups the call

```
B: store.pickup(initator=true)
    -> B: peer.pickup()
        -> A: peer.onPickup()
        -> A: store.pickup
            -> A: route to /call
            -> A: peer.addStream(local)
                -> B: peer.onStream
                -> B: store.ready
    -> B: route to /call
        -> B: addStream(local)
        -> A: peer.onStream
            -> A: store.ready
```

#### B rejects the call

```
B: store.reject(initiator=true)
    -> B: peer.reject()
        -> A: peer.onReject
        -> A: store.reject
```

#### A cancels the call

```
A: store.reject(initiator=true)
    -> A: peer.reject()
        -> B: peer.onReject
        -> B: store.reject
```

#### A or B finishes the call

#### A or B disconnects during the call
