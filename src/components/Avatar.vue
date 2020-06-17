<template lang="pug">
  q-avatar(color="primary")
    q-img(v-if="src" :src="src" :ratio="1")
    div(v-else-if="name") {{initials}}
    q-badge.absolute-bottom-right(v-if="color" color="white" style="border-radius: 10px; width: 14px; height: 14px")
      q-badge.absolute-center(:color="color" style="border-radius: 7px; width: 10px; height: 12px")
</template>

<script lang="ts">
import { Status } from 'src/chat/types'
import { defineComponent, computed, PropType } from '@vue/composition-api'

const colors: { [key in Status]?: string } = {
  busy: 'red',
  disconnected: 'grey',
  offline: 'grey',
  online: 'grey',
  available: 'green'
}
export default defineComponent({
  name: 'Avatar',
  props: {
    src: String,
    status: {
      type: String as PropType<Status>,
      required: true
    },
    name: String
  },
  setup(props) {
    const color = computed(() => colors[props.status])
    const initials = computed(() => props.name?.charAt(0).toUpperCase())
    return { color, initials }
  }
})
</script>
