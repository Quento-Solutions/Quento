<template>
    <nuxt-child />
</template>

<script lang="ts">
    import { Vue, Component, mixins } from 'nuxt-property-decorator'
    import Analytics from '~/mixins/AnalyticsMixin';
    
    //Store
    //import dashStore from '~/store'


    @Component<DashPage>({
        layout: 'main',
        name : "Dashboard"
    })

    //Analystics Things
    export default class DashPage extends mixins(Analytics) {
        logPage = true;
    }
</script>