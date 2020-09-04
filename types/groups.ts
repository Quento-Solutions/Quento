export interface Group_t{
    title : string;
    // contents : string;
    createdAt : Date;
    // views : number;

    backgroundImageUrl : string;
    authorPhotoUrl : string;
    authorDisplayName : string;

    id ?: string;
}

export interface Date_t_F{
    seconds : number;
    nanoseconds : number
}

export interface Group_t_F{
    title : string;
    // contents : string;

    backgroundImageUrl : string;
    authorPhotoUrl : string;
    authorDisplayName : string;

    createdAt : Date | Date_t_F;
    // views : number;
}

export class Group{
    constructor(
        opts : Group_t
    ){
        return Object.assign(this, opts)
    }

    static fromFirebase = (doc : Group_t_F, id ?: string) =>
    {
        const createdAt = new Date((doc.createdAt as Date_t_F).seconds * 1000)
        const obj = {...doc, createdAt, id};
        return new Group(obj)
    }

    static toFirebase(doc: Group) : Group_t_F
    {
        const {id, ...firebaseDoc} = {...doc}
        return firebaseDoc
    }
}

export interface Group extends Group_t {}
