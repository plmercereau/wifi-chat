<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        div Settings
    q-page-container
      q-page
        div.q-pa-md.justify-center.row
          q-avatar(size="128px" font-size="52px" color="primary")
            img(v-if="avatar" :src="avatar")
            q-btn.absolute-bottom-right(round icon="camera_alt" color="primary" size="sm")
          q-list.col-12
            q-item
              q-item-section(avatar)
                q-icon(name="person")
              q-item-section
                q-item-label(caption) Name
                q-item-label {{name}}
              q-item-section(side top)
                q-btn(icon="create" flat round color="primary" @click="editName")
            q-separator
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { store } from 'src/store'

export default defineComponent({
  name: 'PageChat',
  setup() {
    const name = computed<string>(() => store.getters['local/name'])
    const avatar = computed<string>(() => store.getters['local/avatar'])
    const inputName = ref('')
    const editName = () => {
      inputName.value = name.value
    }
    const changeName = () => {
      store.dispatch('local/name', inputName.value)
    }

    return { name, avatar, editName, changeName }
  }
})
</script>
