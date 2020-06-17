<template lang="pug">
  q-chat-message(:label="day")
</template>

<script lang="ts">
import { OutputMessage } from 'src/chat/types'
import { defineComponent, computed, PropType } from '@vue/composition-api'
import moment from 'moment'

export default defineComponent({
  name: 'MessageTimestamp',
  props: {
    message: {
      type: Object as PropType<OutputMessage>,
      required: true
    }
  },
  setup(props) {
    const day = computed(() =>
      moment(props.message.timestamp).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'dddd, Do'
      })
    )

    return { day }
  }
})
</script>
