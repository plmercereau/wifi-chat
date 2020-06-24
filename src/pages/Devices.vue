<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/')
        q-toolbar-title {{ $t('device_settings') }}
    q-page-container
      q-page
        div.q-pa-md.justify-center.row
          q-avatar(size="128px" font-size="52px" color="primary")
            p-avatar-image(:name="name" :src="avatar")
            q-btn.absolute-bottom-right(round icon="camera_alt" color="primary" size="sm" @click="changeAvatar")
          q-list.col-12
            q-item
              q-item-section(avatar)
                q-icon(name="person")
              q-item-section(v-if="editingName")
                q-input(v-model="inputName"
                  :rules="[val => !!val || $t('required')]"
                  @keydown.enter.prevent="changeName"
                  @blur="editingName = false"
                  :label="$t('name')"
                  borderless dense autofocus hide-bottom-space)
                  template(#append)
                    q-btn(round dense flat icon="save_alt" @click="changeName")
              q-item-section(v-else)
                q-item-label(caption) {{ $t('name') }}
                q-item-label {{name}}
              q-item-section(v-if="!editingName" side top)
                q-btn(icon="create" flat round color="primary" @click="editName")
            q-separator
            q-item
              q-item-section
                q-item-label(caption) {{ $t('language') }}
              q-item-section
                q-item-label
                  p-select-language(dense)
            q-separator
            q-item
              q-item-section
                q-item-label(caption) {{ $t('reset') }}
              q-item-section
                q-btn(@click="reset") {{ $t('reset_button') }}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import PAvatarImage from 'components/AvatarImage.vue'
import PSelectLanguage from 'components/SelectLanguage.vue'
import { useLocal } from 'src/compositions'
import { Plugins, CameraResultType, CameraDirection } from '@capacitor/core'
const { Camera } = Plugins
import { Dialog } from 'quasar'

export default defineComponent({
  name: 'PageChat',
  components: {
    PAvatarImage,
    PSelectLanguage
  },
  setup(_, { root: { $store, $tc, $router } }) {
    // TODO create an inline input component that wraps the 'set name' logic
    const { name, avatar } = useLocal($store)
    const inputName = ref('')
    const editingName = ref(false)
    const editName = () => {
      editingName.value = true
      inputName.value = name.value
    }
    const changeName = async () => {
      await $store.dispatch('local/name', inputName.value)
      editingName.value = false
    }

    const changeAvatar = async () => {
      try {
        const { dataUrl } = await Camera.getPhoto({
          // * See https://capacitor.ionicframework.com/docs/apis/camera/
          quality: 90,
          allowEditing: false,
          direction: CameraDirection.Front,
          // promptLabelHeader: 'Change your avatar',
          resultType: CameraResultType.DataUrl,
          height: 128
        })
        await $store.dispatch('local/avatar', dataUrl)
      } catch (error) {
        console.log('(avatar)', error)
      }
    }

    const reset = () => {
      Dialog.create({
        title: $tc('reset_confirm_title'),
        message: $tc('reset_confirm_message'),
        cancel: true,
        persistent: true,
        focus: 'cancel'
      }).onOk(async () => {
        await $store.dispatch('reset', undefined, { root: true })
        await $router.push('/start')
      })
    }
    return {
      name,
      avatar,
      editName,
      editingName,
      changeName,
      inputName,
      changeAvatar,
      reset
    }
  }
})
</script>
