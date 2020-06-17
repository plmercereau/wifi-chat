<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        q-toolbar-title Settings
    q-page-container
      q-page
        div.q-pa-md.justify-center.row
          q-avatar(size="128px" font-size="52px" color="primary")
            img(v-if="avatar" :src="avatar")
            q-btn.native-mobile-only.absolute-bottom-right(round icon="camera_alt" color="primary" size="sm")
          q-list.col-12
            q-item
              q-item-section(avatar)
                q-icon(name="person")
              q-item-section(v-if="editingName")
                q-input(v-model="inputName"
                  :rules="[val => !!val || 'Required']"
                  @keydown.enter.prevent="changeName"
                  @blur="editingName = false"
                  label="Name"
                  borderless dense autofocus hide-bottom-space)
                  template(v-slot:append)
                    q-btn(round dense flat icon="save_alt" @click="changeName")
              q-item-section(v-else)
                q-item-label(caption) Name
                q-item-label {{name}}
              q-item-section(v-if="!editingName" side top)
                q-btn(icon="create" flat round color="primary" @click="editName")
            q-separator
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { store } from 'src/store'
import { useLocal } from 'src/compositions'

export default defineComponent({
  name: 'PageChat',
  setup() {
    // TODO create an inline input component that wraps the 'set name' logic
    const { name, avatar } = useLocal()
    const inputName = ref('')
    const editingName = ref(false)
    const editName = () => {
      editingName.value = true
      inputName.value = name.value
    }
    const changeName = () => {
      store.dispatch('local/name', inputName.value)
      editingName.value = false
    }

    return { name, avatar, editName, editingName, changeName, inputName }
  }
})
</script>
