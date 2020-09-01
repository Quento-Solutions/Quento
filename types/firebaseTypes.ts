export interface Date_t_F
{
    seconds : number;
    nanoseconds : number
}
export type Date_t_A =
{
    _seconds : number;
    _nanoseconds : number
} | string;
export interface StoredImage
{
    fileName : string;
    imageURL : string;
}
export const firebaseDate = (date : Date_t_F) => date ? new Date(date.seconds * 1000) : new Date(0);
export const algoliaDate = (date : Date_t_A) => new Date((date as string));
