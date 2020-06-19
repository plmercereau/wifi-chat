<template lang="pug">
  q-avatar(color="secondary")
    p-avatar-image(:name="name" :src="src" )
    q-badge.absolute-bottom-right(v-if="color" color="white" style="border-radius: 10px; width: 14px; height: 14px")
      q-badge.absolute-center(:color="color" style="border-radius: 7px; width: 10px; height: 12px")
</template>

<script lang="ts">
import { Status } from 'src/chat/types'
import AvatarImageComponent from 'components/AvatarImage.vue'
import { defineComponent, computed, PropType } from '@vue/composition-api'

const colors: { [key in Status]?: string } = {
  busy: 'red',
  disconnected: 'grey',
  archived: 'grey',
  available: 'green'
}
export default defineComponent({
  name: 'Avatar',
  components: {
    PAvatarImage: AvatarImageComponent
  },
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
