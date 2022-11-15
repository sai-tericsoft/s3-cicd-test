export interface IUser {
    id: number;
    name: string;
    username: string;
    firstName?: string;
    lastName?: string;
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
