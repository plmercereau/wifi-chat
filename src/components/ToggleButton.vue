<template lang="pug">
  q-btn(@click="click" :icon="toggle ? iconTrue : iconFalse" round)
    q-tooltip(v-if="toggle && tooltipTrue") {{tooltipTrue}}
    q-tooltip(v-if="!toggle && tooltipFalse") {{tooltipFalse}}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'ToggleButton',
  props: {
    iconTrue: String,
    iconFalse: String,
    tooltipTrue: String,
    tooltipFalse: String
  },
  setup(props, ctx) {
    // TODO improvement: use (optional) v-model
    const toggle = ref(true)
    const click = () => {
      ctx.emit('toggle')
      toggle.value = !toggle.value
    }

    return { toggle, click }
  }
})
</script>
