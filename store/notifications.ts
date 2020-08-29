import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'

import {Notification, Notification_t_F} from '~/types/notifications';
import {authStore} from '~/store';

@Module({ stateFactory: true, name: 'notifications', namespaced: true })
export default class NotificationsModule extends VuexModule 
{
    notifications : Notification<any>[] = [];

    @Mutation
    private SET_NOTIFICATIONS(notifications : Notification<any>[])
    {
        this.notifications = notifications;
    }

    @Action({rawError : true})
    public async getNotifications()
    {
        if(!authStore.user) return;
        const userId = authStore.user.uid;
        const notifRefs = await firestore.collection("users").doc(userId).collection("notifications").orderBy("createdAt", "desc").get();
        const notifications = notifRefs.docs.map(ntf => Notification.fromFirebase(ntf.data() as Notification_t_F<any>, ntf.id));
        return this.SET_NOTIFICATIONS(notifications);
    }
}