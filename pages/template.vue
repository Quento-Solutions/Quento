<template />

<script lang="ts">
    import { Vue, Component, mixins } from 'nuxt-property-decorator'
    import Analytics from '~/mixins/AnalyticsMixin';

    @Component<GroupsPage>({
        layout: 'main',
        name : "template"
    })
    export default class GroupsPage extends mixins(Analytics) {
    logPage = true;
    }
</script>