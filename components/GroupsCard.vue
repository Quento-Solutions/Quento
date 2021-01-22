<template>
	<!-- Card Outside -->
	<nuxt-link :to="`/groups/g/${group.id}`" v-if="group" id="cardster" tag="div" :style="backgroundGradient(group.backgroundImageUrl)"
		class="
			h-full cursor-pointer
			rounded-super overflow-hidden
			text-white relative
			background-cover
			grid grid-cols-3
		"
	>
		<div class="h-full col-span-2 p-8 flex flex-col justify-between">
			<!-- ===== MAIN INSIDE CARD ===== -->
			<!-- CHECKBOX -->
			<vs-tooltip style="width: max-content">
				<div
					class="rounded-full h-8 w-8 flex items-center justify-center"
					:class="group.approved ? ' bg-green-400' : 'bg-orange-400'"
				>
					<i class="bx text-3xl font-bold" :class="group.approved ? ' bx-check' : 'bx-dots-horizontal'" />
				</div>
				<!-- WORD -->
				<template #tooltip>{{group.approved ? 'Verified' : 'Pending Approval'}}</template>
			</vs-tooltip>
			<div class="flex flex-col">
				<h2 class="text-white font-semibold text-base">Grade {{group.grade}} {{group.subject}}</h2>
				<h1 class="text-white font-bold text-2xl mt-2">{{group.title}}</h1>
				<h3 class="text-white text-sm">{{group.school}}</h3>
			</div>
		</div>

		<!-- ====SIDE==== -->
		<div id="sideboi" class="h-full col-span-1 p-4 text-black font-open flex flex-col justify-between">
			<div>
				<h4 class="font-bold my-1">Description</h4>
				<p id="description" class="text-xs italic mb-4 mt-2 overflow-hidden">
					{{group.description}}
				</p>
			</div>
			<div>
				<h5 class="font-semibold text-md">Members</h5>
				<p class="font-light text-sm">{{group.memberList.length}}</p>
			</div>
		</div>
	</nuxt-link>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator'
import {Group} from '~/types/groups'

@Component<GroupCard>({components: {}})
export default class GroupCard extends Vue {
	@Prop({required: true}) group!: Group

	backgroundGradient(imageUrl: string) {
		return `background-image : linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`
	}
	randomColor() {
		return Math.floor(Math.random() * 16777215).toString(16)
	}
}
</script>

<style lang = "scss">
	#sideboi {
		background-color: #f9f9f9;
		transition: background-color 0.8s ease-in-out;
	}
	#cardster {
		box-shadow: 0px 12px 15px -7px rgba(0, 0, 0, 0.27);
		min-height: 250px;
	}
	/*
	.cardster:hover {
		box-shadow: 0px 19px 37px 3px rgba(0, 0, 0, 0.21);
		.sideboi {
			background-color: white;
			box-shadow: 0px 10px 34px 0px rgba(0, 0, 0, 0.42);
			transition: box-shadow 0.3s ease-in-out;
		}
	} */
</style>