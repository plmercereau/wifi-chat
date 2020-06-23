<template lang="pug">
  q-select(v-model="lang"
    :options="langOptions"
    :label="label"
    :borderless="dense"
    emit-value
    map-options
    :options-dense="dense"
    style="min-width: 150px")
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { Locale } from 'src/chat/types'

export default defineComponent({
  name: 'SelectLanguage',
  props: {
    label: {
      type: String,
      required: false
    },
    dense: {
      type: Boolean,
      required: false
    }
  },
  setup(_, { root: { $store } }) {
    const lang = computed<Locale>({
      get: () => $store.getters['local/locale'],
      set: (value: Locale) => $store.dispatch('local/locale', value)
    })
    const langOptions: { value: Locale; label: string }[] = [
      { value: 'en-us', label: '🇬🇧 English' },
      { value: 'fr', label: '🇫🇷 Français' }
    ]
    return { lang, langOptions }
  }
})
</script>
