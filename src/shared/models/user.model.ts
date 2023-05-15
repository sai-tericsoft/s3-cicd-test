export interface IUser {
    _id: number;
    name: string;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
    address: Address;
    phoneNumber: any;
    role: string;
    website: string;
    status:string;
    isActive:boolean;
    onBoardedDate: string;
    company: Company;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Geo {
    lat: string;
    lng: string;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}
