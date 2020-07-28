import { Module, VuexModule, MutationAction, Action, Mutation,  } from "vuex-module-decorators";

@Module({ stateFactory : true, name : "window", namespaced : true})

export default class WindowModule extends VuexModule {
    windowHeight = 0
    windowWidth = 0;

    screenDimensions = [1356 , 898] as const;
    
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

    public get screenAspectRatio()
    {
        return this.screenDimensions[0] / this.screenDimensions[1];
    }

    public get windowAspectRatio()
    {
        return this.windowWidth / this.windowHeight;
    }
    public get constrainingDimension() : 'width' | 'height' 
    {
        return this.windowAspectRatio > this.screenAspectRatio ? 'width' : 'height';    
    }

    public get screenWidth()
    {
        return this.windowHeight;
    }

    get heightPercent()
    {
        return (percent : number) => percent * this.windowHeight;
    }
    get widthPercent()
    {
        return (percent : number) => percent * this.windowWidth;
    }
}