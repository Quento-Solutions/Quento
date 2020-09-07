<template>
	<VxCard v-if="group" class="overlay-card mb-4 overflow-hidden cardster" style="border-radius: 1.28rem !important"> <!-- Card Outside -->
		<template slot="no-body">
			<nuxt-link :to="`/groups/g/${group.id}`">
				<!-- Background -->
				<div
					class="text-white background-cover p-8 pt-40 relative"
					:style="backgroundGradient(group.backgroundImageUrl)"
				>
					<!-- MAIN INSIDE CARD -->
					<div class="mb-2 w-full font-bold text-white font-open text-4xl">
						{{ group.title }} <!--Title-->
					</div>

					<!-- Author Line -->
					<div class="vx-row w-full" style="">
						<vs-avatar class="icon">
							<img v-if="group.authorPhotoUrl" :src="group.authorPhotoUrl" style="object-fit: cover;height: 100%;"/>
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
					<div class = " sideboi rounded-r-super absolute top-0 right-0 h-full w-33% p-4 text-black font-open">
						<h4 class = "font-bold my-1">Description</h4>
						<div
							:style="`background-color: #${randomColor()}`"
							style = "border-radius:9999px;width:fit-content"
							class = "p-1 px-2 text-xs"
							v-if="group.subject"
						>
							{{group.subject}}
						</div>

						<p class = "text-xs italic font-thin mb-4 mt-2" style="max-height:50%;overflow:hidden">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque semper tortor non ultrices. Nunc porttitor justo ac purus porta placerat. Ut nec diam eget leo volutpat placerat. Etiam a lacus a leo malesuada vehicula a non risus.
						</p>
						
						<h5 class = "font-semibold text-md">Members</h5>
						<p class = "font-light text-sm">{{numberOfMembers}}</p>
					</div>
				</div>
			</nuxt-link>
		</template>
	</VxCard>
</template>

<script lang="ts">
	import { Component, Vue, Prop } from 'nuxt-property-decorator'
	import { Group } from '~/types/groups'

	@Component<GroupCard>({ components: {} })

	export default class GroupCard extends Vue {
		@Prop({ required: true }) group!: Group
		numberOfMembers = (!this.group.memberList) ? 0 : this.group.memberList.length

		backgroundGradient(imageUrl: string) {
			return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
		}
		randomColor() {
			return Math.floor(Math.random() * 16777215).toString(16)
		}
	}
</script>

<style lang = "scss">
	.cardster{
		box-shadow: 0px 12px 15px -7px rgba(0,0,0,0.27);
	}
	.sideboi{
		background-color:#f9f9f9;
		transition: background-color 0.8s ease-in-out;
	}
	.cardster:hover{
		box-shadow: 0px 19px 37px 3px rgba(0,0,0,0.21);
		.sideboi{
			background-color: white;
			box-shadow: 0px 10px 34px 0px rgba(0,0,0,0.42);
			transition: box-shadow 0.3s ease-in-out;
		}
	}
</style>