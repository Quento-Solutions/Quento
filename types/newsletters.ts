import { Module } from 'vuex-module-decorators';


import {Subject_O , Grade_O} from './subjects'

export interface Newsletter_t
{
    title : string;
    uid : string;
    userDisplayName : string;
    userPhotoUrl ?: string;

    images ?: string[];
    contents ?: string;

    createdAt : Date;
    upVotes : number;
    views : number;

    subject : Subject_O;
    grade : Grade_O;
    id ?: string;
}
export interface Date_t_F
{
    seconds : number;
    nanoseconds : number

}
export interface Newsletter_t_F
{
    content: string;

    title : string;
    uid : string;
    userDisplayName : string;
    userPhotoUrl ?: string;

    images ?: string[];
    contents ?: string;

    createdAt : Date_t_F | Date;
    upVotes : number;
    subject : Subject_O;
    grade : Grade_O;
    views : number;
}

export class Newsletter
{

    constructor(
        opts : Newsletter_t
    ){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Newsletter_t_F, id ?: string) =>
    {
        const createdAt = new Date((doc.createdAt as Date_t_F).seconds * 1000)
        const obj = {...doc, createdAt, id};
        return new Newsletter(obj)
    }

    static toFirebase(this: Newsletter) : Newsletter_t_F
    {
        const {id, ...firebaseDoc} = {...this}
        return firebaseDoc
    }
}

export interface Newsletter extends Newsletter_t {}
