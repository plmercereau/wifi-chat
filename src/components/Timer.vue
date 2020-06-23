<template lang="pug">
  div {{timer}}
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import moment from 'moment'
import { store } from 'src/store'

export default defineComponent({
  name: 'Timer',
  props: {
    start: Number
  },
  setup(props) {
    const now = ref(Date.now())
    setInterval(() => {
      now.value = Date.now()
    }, 1000)

    const timer = computed(() =>
      moment(
        now.value - (props.start ? props.start - 1000 * 60 * 60 : 0)
      ).format('HH:mm:ss')
    )
    return { timer }
  }
})
</script>
