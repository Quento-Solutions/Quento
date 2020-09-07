<template>
    <p> test content </p>
</template>

<script lang="ts">
    import { Vue, Component, mixins } from 'nuxt-property-decorator'
    import Analytics from '~/mixins/AnalyticsMixin';

    @Component<GroupsPage>({
        layout: 'main',
        name : "basepiece"
    })
    export default class GroupsPage extends mixins(Analytics) {
    logPage = true;
    }
</script>