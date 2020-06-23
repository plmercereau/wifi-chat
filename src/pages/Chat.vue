<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        p-avatar(:src="server.avatar" :status="server.status" :name="server.name")
        q-toolbar-title {{server.name}}
        q-btn(v-if="server.status ==='available'" flat round icon="videocam" @click="videoCall(server.id)")
        q-btn(v-if="server.status ==='available'" flat round icon="call" @click="audioCall(server.id)")
    q-page-container
      q-page.q-pa-md.justify-center
        div.row
          div(ref="chatRef" style="width: 100%; max-width: 800px")
            p-message(v-for="message of messages" 
              :key="message.timestamp"
              :message="message"
              :server="server")
        q-footer.q-pa-xs.justify-center.row.no-wrap()
          q-input.col(dense filled autofocus :placeholder="$t('type_message')" v-model="message" @keydown.enter.prevent="send")
          q-btn.q-mx-sm(flat round icon="send" @click="send")
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from '@vue/composition-api'
import { store } from 'src/store'
import AvatarComponent from 'components/Avatar.vue'
import MessageComponent from 'components/Message.vue'

import {
  useMessages,
  useScrollDown,
  useSendMessage,
  useServer,
  useCall
} from 'src/compositions'

export default defineComponent({
  name: 'PageChat',
  components: {
    PAvatar: AvatarComponent,
    PMessage: MessageComponent
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (store.getters['servers/get'](to.params['id'])) next()
    else next('/')
  },
  setup(props) {
    const { id } = toRefs(props)
    const server = useServer(id)
    const messages = useMessages(server)
    const { message, send } = useSendMessage(server)
    const { calling, hangup, videoCall, audioCall } = useCall()

    const chatRef = ref<Element>([])
    useScrollDown(chatRef, messages)

    return {
      calling,
      hangup,
      chatRef,
      server,
      messages,
      send,
      message,
      videoCall,
      audioCall
    }
  }
})
</script>
