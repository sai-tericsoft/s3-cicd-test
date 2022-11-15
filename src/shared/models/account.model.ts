export interface IAccountLoginCredentials {
    username: string;
    password: any
}

export interface ILoggedInUser {
    _id: string;
    createdAt: string;
    email: string;
    isActive: boolean;
    isDeleted: boolean;
    name: string;
    orgUId: string;
    phone: string;
    role: string;
    uid: string;
    updatedAt: string;
}

export interface ILoginResponse {
    token: string;
    user: ILoggedInUser;
}

export interface ICheckLoginResponse extends ILoggedInUser {
}


