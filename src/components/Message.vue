<template lang="pug">
  component(:is="type" :message="message" :server="server")
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import DefaultMessageComponent from 'components/DefaultMessage.vue'
import TimestampMessageComponent from 'components/TimestampMessage.vue'
import { ServerConnection, OutputMessage } from 'src/chat/types'

export default defineComponent({
  name: 'Message',
  props: {
    message: {
      type: Object as PropType<OutputMessage>,
      required: true
    },
    server: {
      type: Object as PropType<ServerConnection>,
      required: true
    }
  },
  components: {
    PMessage: DefaultMessageComponent,
    PDate: TimestampMessageComponent
    // call : // TODO
  },

  setup(props) {
    const type = computed(() => `p-${props.message.type}`)
    return { type }
  }
})
</script>
