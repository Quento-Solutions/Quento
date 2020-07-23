export * from './state';

export interface Author {
  name : string;
  bio : string;
  img : string;
}
export interface Article {
  slug : string;

  updatedAt : string;
  createdAt : string; 
  img : string;
  alt : string;
  title : string;
  author : Author;
  description : string;

}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  contact: Contact;
  gender: string;
  ip_address: string;
  avatar: string;
  address: Address;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Address {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}
