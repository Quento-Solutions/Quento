import { Module, VuexModule, MutationAction, Action, Mutation } from "vuex-module-decorators";

@Module({ stateFactory : true, name : "window", namespaced : true})

export default class WindowModule extends VuexModule {
    windowHeight = 0
    windowWidth = 0;
    
    @Mutation
    private UPDATE_WINDOW_SIZE(a : {height : number , width : number})
    {
        this.windowHeight = a.height;
        this.windowWidth = a.width;
    }
    @Action
    public handleResize() {
    this.UPDATE_WINDOW_SIZE({
                height : window.innerHeight,
                width : window.innerWidth,
            })
    }
}