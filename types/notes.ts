
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

    id ?: string;
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

    createdAt : Date;
    upVotes : number;
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

        const obj = {...doc, createdAt : new Date(doc.createdAt), id};
        return new Note(obj)
    }

    toFirebase() : Note_t_F
    {
        const {id, ...firebaseDoc} = {...this}
        return firebaseDoc
    }
}
export interface Note extends Note_t {}
