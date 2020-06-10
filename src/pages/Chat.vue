<template lang="pug">
  q-page
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        q-avatar(v-if="server.avatar")
          img(:src="server.avatar")
        q-toolbar-title {{server.name}}
        q-btn(flat round icon="videocam")
        q-btn(flat round icon="call")
    div.q-pa-md.justify-center.row
      div(ref="chatRef" style="width: 100%; max-width: 800px")
        q-chat-message(label="Sunday, 19th")
        message(v-for="message in messages"
          :key="message.receivedAt || message.sentAt"
          :message="message"
          :server="server")
    q-footer.q-pa-xs.justify-center.row.no-wrap()
      q-input.col(dense rounded standout autofocus placeholder="Type your message" v-model="message" @keydown.enter.prevent="send")
      q-btn.q-mx-sm(flat round icon="send" @click="send")
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'
import MessageComponent from 'components/Message.vue'
import { ServerConnection, Message } from '../chat/types'
import { scroll } from 'quasar'
const { getScrollHeight, getScrollTarget, setScrollPosition } = scroll
import { store } from 'src/store'

export default defineComponent({
  name: 'PageChat',
  components: {
    message: MessageComponent
  },
  props: {
    id: String
  },
  beforeRouteEnter: (to, from, next) => {
    if (store.getters['servers/get'](to.params['id'])) next()
    else next('/')
  },
  setup(props, { root }) {
    const chatRef = ref<Element>([])

    const server = computed<ServerConnection>(() =>
      root.$store.getters['servers/get'](props.id)
    )

    const messages = computed<Message[]>(() =>
      root.$store.getters['messages/get'](props.id)
    )
    const message = ref('')
    const scrollDown = (duration = 500) => {
      const target = getScrollTarget(chatRef.value)
      const offset = getScrollHeight(chatRef.value)
      setScrollPosition(target, offset, duration)
    }
    onMounted(() => {
      scrollDown(1)
    })
    const send = () => {
      if (!message.value) return
      console.log(`Sending ${message.value}`)
      root.$store.dispatch('messages/send', {
        id: props.id,
        message: message.value
      })
      message.value = ''
      scrollDown()
    }

    return { chatRef, server, messages, send, message }
  }
})
</script>
