
<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter justify-center items-center" :style="`background-image: url('${require('~/assets/images/faq.jpg')}')`">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4">
            <VxCard>
                <div class="vx-card__title mb-6">
                    <h2 class="text-center">We are launching soon</h2>
                </div>
                <img src="~assets/images/rocket.png" alt="coming-soon" class="mx-auto mb-2" width="150">
                <!-- <p>Thank you for checking out our app. We are under construction, we will be here soon with our new awesome app. </p> -->
                <div class="count-down">
                    <countdown :time="new Date('08/12/2020 00:00:00').getTime() - new Date().getTime()">
                        <template slot-scope="props">
                            <div class="single-counter">
                                <span class="timer">{{ props.days }}</span>
                                <span>Days</span>
                            </div>
                            <div class="single-counter">
                                <span class="timer">{{ props.hours }}</span>
                                <span>Hours</span>
                            </div>
                            <div class="single-counter">
                                <span class="timer">{{ props.minutes }}</span>
                                <span>Minutes</span>
                            </div>
                            <div class="single-counter">
                                <span class="timer">{{ props.seconds }}</span>
                                <span>Seconds</span>
                            </div>
                        </template>
                    </countdown>
                </div>
                <div class="subscription">
                    <span>If you would like to be notified when our app is live, Please subscribe to our mailing list.</span>
                    <vs-input type="email" label-placeholder="Email" v-model="value1" class="w-full mb-4" />
                    <vs-button class="w-full">Subscribe</vs-button>
                </div>
            </VxCard>
        </div>
    </div>
</template>

<script>
import VxCard from '~/components/VxCard.vue'
export default {
    data() {
        return {
            value1: ''
        }
    },
    components :
        {
            VxCard
        }

}
</script>
