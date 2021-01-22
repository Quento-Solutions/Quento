<template>
	<div>
		<UserGuideModal></UserGuideModal>
		<UserInfoModal></UserInfoModal>
		<!-- <Sidebar @focus="handleFocus" @focusout="handleFocusOut" tabindex="0"></Sidebar> -->
		<!-- <TopNav :navbarColor="navbarColor" :class="[{ 'text-white': isNavbarDark && !isThemeDark },{ 'text-base': !isNavbarDark && isThemeDark }]"/> -->
		<!-- Content -->
		<div style="margin-left:60px" class="h-full">
			<transition :name="routerTransition" mode="out-in">
				<nuxt />
			</transition>
		</div>
	</div>  
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins, Watch } from 'nuxt-property-decorator'

import Sidebar from '~/components/Sidebar.vue'
import TopNav from '~/components/TopNav.vue'
import UserGuideModal from '~/screens/UserGuideModal.vue'
import UserInfoModal from '~/screens/UserInformationModal.vue'

import UserMixin from '~/mixins/UserMixin'

import themeConfig from '~/utils/themeConfig'

@Component<StandardLayout>({
	components: {
		Sidebar,
		TopNav,
		UserGuideModal,
		UserInfoModal,
	},
})
export default class StandardLayout extends mixins(UserMixin) {
	routerTransition = themeConfig.routerTransition || 'none'
}
</script>