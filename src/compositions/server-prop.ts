import { computed } from '@vue/composition-api'
import { ServerConnection } from 'src/chat/types'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { store } from 'src/store'

export const useServer = (
  props: ExtractPropTypes<
    {
      id: StringConstructor
    },
    true
  >
) => {
  return computed<ServerConnection>(() =>
    store.getters['servers/get'](props.id)
  )
}
