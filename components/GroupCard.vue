<template>
	<div class = "lg:w-33% md:w-50% sm:100%">
		<VxCard v-if="group" class="overlay-card mb-4 overflow-hidden rounded-super"> <!-- Card Outside -->
			<template slot="no-body">
				<nuxt-link :to="`/groups/${group.id}`">
					<!-- Background -->
					<div
						class="text-white background-cover p-8 pt-40 relative"
						:style="backgroundGradient(group.backgroundImageUrl)"
					>
						<!-- MAIN INSIDE CARD -->
						<div class="mb-4 w-full font-bold text-white font-open text-4xl">
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

						<!-- Side -->
						<div class = "bg-grey rounded-r-super absolute top-0 right-0 h-full w-33% p-4 text-black font-open">
							<h4 class = "my-2 font-bold">Description</h4>
							<p class = "text-sm italic font-thin">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque semper tortor non ultrices. Nunc porttitor justo ac purus porta placerat. Ut nec diam eget leo volutpat placerat. Etiam a lacus a leo malesuada vehicula a non risus.
							</p>
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
