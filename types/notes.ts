
import {Subject_O , Grade_O} from './subjects'

export interface Note_t
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
export interface Note_t_F
// How the data is stored in firebase
{
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

export class Note
{

    constructor(
        opts : Note_t
    ){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Note_t_F, id ?: string) =>
    {

        const createdAt = new Date((doc.createdAt as Date_t_F).seconds * 1000)
        const obj = {...doc, createdAt, id};
        return new Note(obj)
    }

    static toFirebase = (note : Note) : Note_t_F =>
    {
        const {id, ...firebaseDoc} = {...note}
        return firebaseDoc
    }
}
export interface Note extends Note_t {}
