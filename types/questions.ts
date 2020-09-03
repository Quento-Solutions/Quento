import {Date_t_F, Date_t_A, firebaseDate, algoliaDate, StoredImage} from './firebaseTypes';
import { School_O } from './schools';
import type {Keyword_O, Subject_O , Grade_O} from './subjects'


export interface Question_t
{
    id ?: string;
    createdAt : Date;

    title : string;
    contents : string;
    keywords ?: Keyword_O[];
    subject : Subject_O;
    grade : Grade_O;
    school ?: School_O;
    storedImages ?: StoredImage[];
    
    upVotes : number;
    views : number;
    responses : number;
    
    userPhotoUrl ?: string;
    userId : string;
    userDisplayName : string;
}


export interface Question_t_F
{
    createdAt : Date_t_F | Date;
    
    title : string;
    contents : string;
    subject : Subject_O;
    grade : Grade_O;
    
    upVotes : number;
    views : number;
    responses : number;
    keywords ?: Keyword_O[]
  school ?: School_O;

    storedImages ?: StoredImage[];
    
    userPhotoUrl ?: string;
    userId : string;
    userDisplayName : string;
}
export type Question_t_A = Question_t_F &
{
    createdAt : Date_t_A
    objectID : string;
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
    static fromAlgolia = (doc : Question_t_A) =>
    {
        const {objectID, ...obj} = {...doc, createdAt : algoliaDate(doc.createdAt as Date_t_A), id : doc.objectID};
        return new Question(obj)
    }

    static toFirebase(question : Question) : Question_t_F
    {
        const {id, ...firebaseDoc} = {...question}
        return firebaseDoc
    }
}
export interface Question extends Question_t {}
