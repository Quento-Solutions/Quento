<template>
    <div class="w-full ml-2">
        <!-- Bottom Navbar -->
        <div id="dashNav" class = "fixed flex flex-row justify-around bottom-0 bg-white p-4 px-6 rounded-lg shadow-lg" style="width:94%;bottom:1rem">
            <div>
                User Activity
            </div>
            <div>
                New Users
            </div>
            <div>
                Notes
            </div>
            <div>
                Questions and Responses
            </div>
            <div>
                Groups
            </div>
        </div>

        <!-- Cards -->
        <div class = "grid grid-cols-4 gap-4">
            <!-- Users Card -->
            <div class = "bg-blue-300 m-4 p-6 py-10 grid grid-cols-3 rounded-super col-span-1">
                <div class="col-span-2">
                    <div class = "font-open text-edwinsPenis font-semibold text-center leading-none">
                        180
                    </div>
                    <div class = 'text-center font-open font-semibold text-4xl leading-none'>
                        users
                    </div>
                </div>
                <div class = "flex flex-col justify-between" id='timeList'>
                    <div>
                        Today
                    </div>
                    <div>
                        This Week
                    </div>
                    <div>
                        This Month
                    </div>
                    <div>
                        All Time
                    </div>
                </div>
            </div>
            <!-- User Histogram -->
            <div class = "col-span-3 bg-red-30">

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'nuxt-property-decorator'
    import { Bar } from 'vue-chartjs'
    export default{
        extends: Bar,
        mounted () {
            //this.renderChart(data, options)
        }
    }
</script>

<style lang="scss" scoped>
    #timeList div:hover{
        @apply font-open font-bold text-right cursor-pointer;
        font-size: 1.45rem;
        padding: 0.75rem 0;
    }
    #timeList div{
        @apply font-open font-normal text-lg text-right;
        transition: 0.3s;
    }
    #dashNav{
        div{
            @apply font-open font-semibold text-xl;
        }
    }
</style>