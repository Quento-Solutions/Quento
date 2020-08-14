export interface Date_t_F
{
    seconds : number;
    nanoseconds : number

}

export const firebaseDate = (date : Date_t_F) => new Date((date).seconds * 1000);