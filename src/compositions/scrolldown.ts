import { Ref, onMounted, watch } from '@vue/composition-api'
import { scroll } from 'quasar'
const { getScrollHeight, getScrollTarget, setScrollPosition } = scroll

export const useScrollDown = <T>(
  element: Ref<Element | undefined>,
  watchedRef: Ref<T>
): void => {
  const scrollDown = (duration = 500) => {
    if (element.value) {
      const target = getScrollTarget(element.value)
      const offset = getScrollHeight(element.value)
      setScrollPosition(target, offset, duration)
    }
  }

  onMounted(() => {
    let firstTime = true
    scrollDown(1)
    watch(
      () => watchedRef.value,
      () => {
        if (firstTime) {
          firstTime = false
        } else scrollDown()
      }
    )
  })
}
