import Vue from 'vue'
import Vuesax from 'vuesax'
import type {PluginFunction} from 'vue'

const CustomPlugin: PluginFunction<any> = (Vue, options) => {
  // Vue.mixin(CustomPluginMixin)
  const Vue2 = Vue.use(Vuesax)
  Vue2.prototype.$qto = {
    error(error: any) {
      Vue2.prototype.$vs.notification({
        color: 'danger',
        title: error.message
      })
      console.error(error)
    }
  }
  return Vue2
}

Vue.use(CustomPlugin)
