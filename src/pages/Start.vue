<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-toolbar-title {{ $t('start') }}
    q-page-container
      q-page.q-pa-md(style="max-width: 450px")
        q-input.row(v-model="name"
          :rules="[val => !!val || $t('required')]"
          @keydown.enter.prevent="save"
          :label="$t('name')"
            autofocus)
        p-select-language.row(:label="$t('language')")
        div.row.justify-center
          q-btn.self-center(@click="save") {{ $t('start') }}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import PSelectLanguage from 'components/SelectLanguage.vue'

export default defineComponent({
  name: 'PageIndex',
  components: {
    PSelectLanguage
  },
  setup(_, { root: { $store, $router } }) {
    const name = ref<string>('')
    const save = async () => {
      if (name.value) {
        $store.dispatch('local/name', name.value)
        await $store.dispatch('local/start')
        $router.push('/')
      }
    }
    return {
      name,
      save
    }
  }
})
</script>
