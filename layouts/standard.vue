<template>
	<div>
		<UserGuideModal></UserGuideModal>
		<UserInfoModal></UserInfoModal>
		<Sidebar id="SIDEBAR" @focus="handleFocus" @focusout="handleFocusOut" tabindex="0"></Sidebar>
		<!-- Content -->
		<div style="margin-left:60px;margin-right:10px" class="h-full">
			<TopNav id="TOPBAR" :navbarColor="navbarColor"/>
			<transition :name="routerTransition" mode="out-in">
				<nuxt id="LAYOUTMAIN"/>
			</transition>
		</div>
	</div>  
</template>

<script lang="ts">
import { Component, Prop, Vue, mixins, Watch } from 'nuxt-property-decorator'

//COMPONENTS
import Sidebar from '~/components/Sidebar.vue'
import TopNav from '~/components/TopNav.vue'
import UserGuideModal from '~/screens/UserGuideModal.vue'
import UserInfoModal from '~/screens/UserInformationModal.vue'

//COMPONENT RELATED STORES
import { windowStore } from '~/store'

import UserMixin from '~/mixins/UserMixin'

import themeConfig from '~/utils/themeConfig'

@Component<StandardLayout>({
	components: {
		Sidebar,
		TopNav,
		UserGuideModal,
		UserInfoModal,
	},
	mounted(){
		window.addEventListener('resize', windowStore.handleResize)
    	windowStore.handleResize()
	}
})
export default class StandardLayout extends mixins(UserMixin) {
	routerTransition = themeConfig.routerTransition || 'none'
	
	navbarColor = themeConfig.navbarColor || '#fff'
	handleFocus(){}
	handleFocusOut(){}
}
</script>