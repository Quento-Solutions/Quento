import { Module, VuexModule, MutationAction, Action, Mutation,  } from "vuex-module-decorators";

@Module({ stateFactory : true, name : "window", namespaced : true})

export default class WindowModule extends VuexModule {
    windowHeight = 0
    windowWidth = 0;

    sidenavIsOpen = false;
    notesSidebarOpen = false;

    readonly screenDimensions = [1356 , 898] as const;


    @Mutation
    private UPDATE_WINDOW_SIZE(a : {height : number , width : number})
    {
        this.windowHeight = a.height;
        this.windowWidth = a.width;
    }

    @Action
    public SetSidenavState(open : boolean)
    {
        this.SET_SIDENAV_OPEN(open);
    }

    @Mutation
    private SET_SIDENAV_OPEN(open : boolean)
    {
        this.sidenavIsOpen = open;
    }


    @Action
    public SetNotesState(open : boolean)
    {
        this.SET_NOTESBAR_OPEN(open);
    }

    @Mutation
    private SET_NOTESBAR_OPEN(open : boolean)
    {
        this.notesSidebarOpen = open;
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

    get heightPercent()
    {
        return (percent : number) => percent * this.windowHeight;
    }
    get widthPercent()
    {
        return (percent : number) => percent * this.windowWidth;
    }

    public get isSmallScreen()
    {
        return this.windowWidth < 992;
    }

    public get sidebarOpen()
    {
        return !this.isSmallScreen || this.sidenavIsOpen;
    }

}