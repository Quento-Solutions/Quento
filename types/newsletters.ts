
export interface Newsletter_t
{
    id ?: string;
  title : string;
  content: string;
  createdAt: Date;
}

export interface Newsletter_t_F
{
    title : string;
    content: string;
    createdAt: Date;
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

        const obj = {...doc, createdAt : new Date(doc.createdAt), id};
        return new Newsletter(obj)
    }

    toFirebase() : Newsletter_t_F
    {
        const {id, ...firebaseDoc} = {...this}
        return firebaseDoc
    }
}

export interface Newsletter extends Newsletter_t {}
