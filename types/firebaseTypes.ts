export interface Date_t_F
{
    seconds : number;
    nanoseconds : number
}
export interface Date_t_A
{
    _seconds : number;
    _nanoseconds : number
}

export const firebaseDate = (date : Date_t_F) => new Date(date.seconds * 1000);
export const algoliaDate = (date : Date_t_A) => new Date(date._seconds * 1000);
