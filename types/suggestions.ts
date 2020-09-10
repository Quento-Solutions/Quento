export interface Suggestion_t
{
    id ?: string;
    contents : string;
    createdAt : Date;
    title : string;
    uid : string;
    upVotes : number;
    userDisplayName : string;
}

export interface Suggestion_t_F
{
    contents : string;
    createdAt : Date;
    title : string;
    uid : string;
    upVotes : number;
    userDisplayName : string;
}

export class Suggestion
{

    constructor(opts : Suggestion_t){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Suggestion_t_F, id ?: string) =>
    {
        const obj = {...doc, createdAt : new Date(doc.createdAt), id};
        return new Suggestion(obj)
    }

    toFirebase() : Suggestion_t_F{
        const {id, ...firebaseDoc} = {...this}
        return firebaseDoc
    }
}
export interface Suggestion extends Suggestion_t {}
