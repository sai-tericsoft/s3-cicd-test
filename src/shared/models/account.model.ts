export interface IAccountLoginCredentials {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: ILoggedInUser;
}

export interface ILoggedInUser {
    _id: string;
    first_name: string;
    last_name: string;
    primary_email: string;
    gender: string;
    role: string;
    is_active: boolean;
    signature_url: string;
}

export interface ICheckLoginResponse {
    user: ILoggedInUser;
}


