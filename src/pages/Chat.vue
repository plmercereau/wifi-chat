<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        avatar(:src="server.avatar" :status="server.status" :name="server.name")
        q-toolbar-title {{server.name}}
        q-btn(flat round icon="videocam" @click="videoCall")
        q-btn(flat round icon="call" @click="audioCall")
    q-page-container
      q-page.q-pa-md.justify-center
        div.row
          div(ref="chatRef" style="width: 100%; max-width: 800px")
            template(v-for="[date, dayMessages] in messages")
              q-chat-message(:label="day(date)")
              message(v-for="m in dayMessages"
                :key="m.receivedAt || m.sentAt"
                :message="m"
                :server="server")
        q-footer.q-pa-xs.justify-center.row.no-wrap()
          q-input.col(dense rounded standout autofocus placeholder="Type your message" v-model="message" @keydown.enter.prevent="send")
          q-btn.q-mx-sm(flat round icon="send" @click="send")
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'
import { scroll } from 'quasar'
const { getScrollHeight, getScrollTarget, setScrollPosition } = scroll
import moment from 'moment'
import { store } from 'src/store'
import AvatarComponent from 'components/Avatar.vue'
import MessageComponent from 'components/Message.vue'
import { ServerConnection, Message } from '../chat/types'

export default defineComponent({
  name: 'PageChat',
  components: {
    avatar: AvatarComponent,
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
      scrollDown()
    })
    const day = (date: string) => {
      return moment(date).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'dddd, Do'
      })
    }
    const send = () => {
      if (!message.value) return
      console.log(`Sending ${message.value}`)
      root.$store.dispatch('messages/send', {
        id: props.id,
        message: [message.value]
      })
      message.value = ''
      scrollDown()
    }

    const call = async (constraints: MediaStreamConstraints) => {
      await store.dispatch('call/call', { id: props.id, constraints })
    }
    const videoCall = async () => {
      await call({
        audio: true,
        video: true
      })
    }
    const audioCall = async () => {
      await call({
        audio: true,
        video: false
      })
    }
    return {
      chatRef,
      server,
      messages,
      send,
      message,
      day,
      videoCall,
      audioCall
    }
  }
})
</script>
