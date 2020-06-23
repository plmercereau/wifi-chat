<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-toolbar-title {{ $t('start') }}
    q-page-container
      q-page.q-pa-md
        div.row.justify-center 
          q-input.col-8(v-model="name"
            :rules="[val => !!val || $t('required')]"
            @keydown.enter.prevent="save"
            :label="$t('name')"
            dense autofocus)
        div.row.justify-center
          q-btn.self-center(@click="save") {{ $t('start') }}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import AvatarComponent from 'components/Avatar.vue'
import { store } from 'src/store'
import { useStart } from 'src/chat'

export default defineComponent({
  name: 'PageIndex',
  components: {
    avatar: AvatarComponent
  },
  setup(_, { root: { $router } }) {
    const name = ref<string>('')
    const avatar = ref<string>('')
    const start = useStart(store)
    const save = async () => {
      if (name.value) {
        store.dispatch('local/name', name.value)
        if (avatar.value) {
          store.dispatch('local/avatar', avatar.value)
        }
        await start()
        $router.push('/')
      }
    }
    return {
      avatar,
      name,
      save
    }
  }
})
</script>
