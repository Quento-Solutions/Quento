import {Date_t_F, firebaseDate} from './firebaseTypes';
import type {Keyword_O} from './subjects'

export interface Question_t
{
    id ?: string;
    createdAt : Date;

    title : string;
    contents : string;
    
    upVotes : number;
    views : number;
    responses : number;
    keywords ?: Keyword_O[]
    
    userPhotoUrl ?: string;
    userId : string;
    userDisplayName : string;
}

export interface Question_t_F
{
    createdAt : Date_t_F | Date;
    
    title : string;
    contents : string;
    
    upVotes : number;
    views : number;
    responses : number;
    keywords ?: Keyword_O[]
    
    userPhotoUrl ?: string;
    userId : string;
    userDisplayName : string;
}

export class Question
{

    constructor(
        opts : Question_t
    ){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Question_t_F, id ?: string) =>
    {

        const obj = {...doc, createdAt : firebaseDate(doc.createdAt as Date_t_F), id};
        return new Question(obj)
    }

    static toFirebase(question : Question) : Question_t_F
    {
        const {id, ...firebaseDoc} = {...question}
        return firebaseDoc
    }
}
export interface Question extends Question_t {}
