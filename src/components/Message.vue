<template lang="pug">
  q-chat-message(:name="name"
    :avatar="avatar"
    :text="text"
    :stamp="stamp"
    :sent="sent")
</template>

<script lang="ts">
import { Message, ServerConnection } from 'src/chat/types'
import {
  defineComponent,
  computed,
  PropType,
  ref,
  toRefs
} from '@vue/composition-api'
import { store } from 'src/store'
import moment from 'moment'

export default defineComponent({
  name: 'Message',
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true
    },
    server: {
      type: Object as PropType<ServerConnection>,
      required: true
    }
  },
  setup(props) {
    const { server, message } = toRefs(props)
    const avatar = computed(() =>
      message.value.sent ? store.getters['local/avatar'] : server.value.avatar
    )
    const now = ref(Date.now())
    setInterval(() => (now.value = Date.now()), 3000)
    const stamp = computed(() =>
      moment(message.value.receivedAt || message.value.sentAt).from(now.value)
    )
    const name = computed(() => (message.value.sent ? 'me' : server.value.name))
    const text = computed(() => [message.value.message])
    const sent = computed(() => message.value.sent)
    return { stamp, avatar, name, text, sent }
  }
})
</script>
