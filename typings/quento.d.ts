import Vue from 'vue'

declare module 'vue/types/vue'
{
    interface Vue
    {
        $vs : {
            notification : any;
            loading : any;
        }
        $qto :
        {
            error(error : any) : void;
        }
    }
}