import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useDefaultDataStore = defineStore('defaultData', () => {
    const defaultAvatarURL = ref<string>("");

    const getDefaultAvatarURL = computed(() => defaultAvatarURL.value);

    function setDefaultAvatarURL(v: string) {
        defaultAvatarURL.value = v;
    }


    return {defaultAvatarURL, getDefaultAvatarURL, setDefaultAvatarURL}
})