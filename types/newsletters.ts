import { Module } from 'vuex-module-decorators';


import {Subject_O , Grade_O} from './subjects'

export interface Newsletter_t
{
    title : string;
    contents : string;

    createdAt : Date;
    views : number;

    backgroundImageUrl : string;
    authorPhotoUrl : string;
    authorDisplayName : string;

    id ?: string;
}
export interface Date_t_F
{
    seconds : number;
    nanoseconds : number

}
export interface Newsletter_t_F
{

    title : string;
    contents : string;

    backgroundImageUrl : string;
    authorPhotoUrl : string;
    authorDisplayName : string;

    createdAt : Date | Date_t_F;
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

    static toFirebase(doc: Newsletter) : Newsletter_t_F
    {
        const {id, ...firebaseDoc} = {...doc}
        return firebaseDoc
    }
}

export interface Newsletter extends Newsletter_t {}
