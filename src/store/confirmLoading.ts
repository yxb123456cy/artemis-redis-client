import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useConfirmLoadingStore = defineStore('confirmLoading', () => {
    const loadingState = ref<boolean>(false);

    const getLoadingState = computed(() => loadingState.value);

    function setLoadingState(v: boolean) {
        loadingState.value = v;
    }

    function toggleLoadState() {
        loadingState.value = !loadingState.value;
    }

    return {loadingState, getLoadingState, toggleLoadState, setLoadingState}
})