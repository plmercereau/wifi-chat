<template lang="pug">
  q-chat-message(:label="day")
</template>

<script lang="ts">
import { OutputMessage } from 'src/chat/types'
import { defineComponent, computed, PropType } from '@vue/composition-api'
import moment from 'moment'
import { i18n } from 'src/boot/i18n'

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
        sameDay: i18n.tc('moment.today'),
        lastDay: i18n.tc('moment.yesterday'),
        lastWeek: i18n.tc('moment.lastWeek'),
        sameElse: i18n.tc('moment.other')
      })
    )

    return { day }
  }
})
</script>
