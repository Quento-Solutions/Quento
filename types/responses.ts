import {Date_t_F, firebaseDate} from './firebaseTypes';
import type {Keyword_O} from './subjects'
import type {Subject_O , Grade_O} from './subjects'

export interface Response_t
{
    id ?: string;
    createdAt : Date;
    userId : string;
    questionId : string;

    contents : string;
    
    upVotes : number;
    views : number;
    
    userPhotoUrl ?: string;
    userDisplayName : string;
}


export interface Response_t_F
{
    createdAt : Date_t_F | Date;
    
    contents : string;
    
    upVotes : number;
    views : number;
    questionId : string;
    
    userPhotoUrl ?: string;
    userId : string;
    userDisplayName : string;
}

export type Response_t_A = Response_t_F &
{
    objectID : string;
}

export class Response
{

    constructor(
        opts : Response_t
    ){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Response_t_F, id ?: string) =>
    {

        const obj = {...doc, createdAt : firebaseDate(doc.createdAt as Date_t_F), id};
        return new Response(obj)
    }

    static toFirebase(doc : Response) : Response_t_F
    {
        const {id, ...firebaseDoc} = {...doc}
        return firebaseDoc
    }
}
export interface Response extends Response_t {}
