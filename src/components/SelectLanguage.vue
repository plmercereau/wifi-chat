<template lang="pug">
  q-select(v-model="lang"
    :options="langOptions"
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 150px")
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { store } from 'src/store'
import { Locale } from 'src/chat/types'

export default defineComponent({
  name: 'SelectLanguage',
  setup(props) {
    const lang = computed<Locale>({
      get: () => store.getters['local/locale'],
      set: (value: Locale) => store.dispatch('local/locale', value)
    })
    const langOptions = [
      { value: 'en-us', label: 'English' },
      { value: 'fr', label: 'Français' }
    ]
    return { lang, langOptions }
  }
})
</script>
