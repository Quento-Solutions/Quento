<template>
	<div class = "groupCard">
		<VxCard v-if="group" class="overlay-card mb-4"> <!-- Card Outside -->
			<template slot="no-body">
				<nuxt-link :to="`/groups/${group.id}`">
					<!-- Background -->
					<div
						class="text-white background-cover p-10 pt-40 h-full"
						:style="backgroundGradient(group.backgroundImageUrl)"
					>
						<!-- MAIN INSIDE CARD -->
						<div class="mb-4 w-full font-bold text-white text-open text-4xl">
							{{ group.title }} <!--Title-->
						</div>

						<!-- Author Line -->
						<div class="vx-row w-full" style="">
							<vs-avatar class="icon">
								<img v-if="group.authorPhotoUrl" :src="group.authorPhotoUrl"/>
								<template #text v-else>
									{{ group.authorDisplayName }}
								</template>
							</vs-avatar>
							<div class="vx-row flex-wrap pl-4" style="max-width: 75%;">
								<div class="w-full text-ginger truncate font-semibold" style="">
									{{ group.authorDisplayName }}
								</div>
								<div class="text-ginger truncate font-light" style="">
									{{ group.createdAt.toDateString() }}
								</div>
							</div>
						</div>
					</div>
				</nuxt-link>
			</template>
		</VxCard>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop } from 'nuxt-property-decorator'
	import { Group } from '~/types/groups'

	@Component<GroupCard>({ components: {} })

	export default class GroupCard extends Vue {
		@Prop({ required: true }) group!: Group

		backgroundGradient(imageUrl: string) {
			return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
		}
	}
</script>


<style scoped>
	@media only screen and (max-width: 991px) {
		.groupCard {width:49% !important;}
	}
	@media only screen and (max-width: 768px) {
		.groupCard {width:100% !important;}
	}
	.groupCard{
		width: 32.9%;
	}
</style>