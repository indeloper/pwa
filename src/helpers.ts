import { useWindowSize } from '@vueuse/core'
import { reactive } from 'vue';

const windowSize = reactive(useWindowSize())

export const isMobile = () => {
    return windowSize.width < 768;
}