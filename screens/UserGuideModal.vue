<template>
    <vs-dialog v-model="userGuideStoreOpen">
        Allo there
    </vs-dialog>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import { userGuideStore, authStore } from '~/store';
@Component<UserGuideModal>({ components : {

}})
export default class UserGuideModal extends Vue 
{
    thingOpen = false;
    get userGuideStoreOpen()
    {
        return !userGuideStore.UserGuideClosed && !authStore.userData?.userGuideClosed;
    }

    set userGuideStoreOpen( value : boolean )
    {
        // console.log({CLOSE : value})
        userGuideStore.SET_GUIDE_CLOSED(!value);
    }
}
</script>